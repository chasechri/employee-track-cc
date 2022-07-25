require("dotenv").config();
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const { resolvePtr } = require("dns");
require("console.table");

// create connection with db
let connect = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const menu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What do you want to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "exit",
        ],
      },
    ])
    .then((uChoice) => {
      switch (uChoice.menu) {
        case "view all departments":
          departments();
          break;
        case "view all roles":
          roles();
          break;
        case "view all employees":
          chooseEmployee();
          break;
        case "add a department":
          newDepartment();
          break;
        case "add a role":
          newRole();
          break;
        case "add an employee":
          newEmployee();
          break;
        case "update an employee role":
          updateRole();
          break;
        default:
          process.exit();
      }
    });
};

// choose departments
const departments = () => {
  connect.query("SELECT * FROM department;", (err, data) => {
    console.table(data);
    menu();
  });
};

// choose roles
const roles = () => {
  connect.query("SELECT * FROM role;", (err, data) => {
    console.table(data);
    menu();
  });
};

// choose employees
const chooseEmployee = () => {
  connect.query(
    "SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
    (err, data) => {
      console.table(data);
      menu();
    }
  );
};

// make a new department
const newDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What department would you like to add?",
        validate: (depName) => {
          if (depName) {
            return true;
          } else {
            console.log("Please enter a name for the department.");
            return false;
          }
        },
      },
    ])
    .then((name) => {
      connect.promise().query("INSERT INTO department SET ?", name);
      departments();
    });
};

//  add a  role
const newRole = () => {
  return connect
    .promise()
    .query("SELECT department.id, department.name FROM department;")
    .then(([departments]) => {
      let depOptions = departments.map(({ id, name }) => ({
        name: name,
        value: id,
      }));
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "Enter name of your role.",
            validate: (roleName) => {
              if (roleName) {
                return true;
              } else {
                console.log("Please enter a title for your role.");
              }
            },
          },
          {
            type: "list",
            name: "department",
            message: "Which department the are you in?",
            choices: depOptions,
          },
          {
            type: "input",
            name: "salary",
            message: "Enter salary",
            validate: (salary) => {
              if (salary) {
                return true;
              } else {
                console.log("Please enter your salary.");
                return false;
              }
            },
          },
        ])
        .then(({ title, department, salary }) => {
          const query = connect.query(
            "INSERT INTO role SET?",
            {
              title: title,
              department_id: department,
              salary: salary,
            },
            function (err, res) {
              if (err) throw err;
            }
          );
        })
        .then(() => roles());
    });
};

// add an employee
const newEmployee = () => {
  return connect
    .promise()
    .query("SELECT R.id, R.title FROM role R;")
    .then(([employees]) => {
      let titleOpt = employees.map(({ id, title }) => ({
        value: id,
        name: title,
      }));
      connect
        .promise()
        .query(
          "SELECT E.id, CONCAT(E.first_name,' ',E.last_name) AS manager FROM employee E;"
        )
        .then(([managers]) => {
          let manOptions = managers.map(({ id, manager }) => ({
            value: id,
            name: manager,
          }));
          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "What is the employees first name?",
                validate: (firstName) => {
                  if (firstName) {
                    return true;
                  } else {
                    console.log("Please enter a first name");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "lastName",
                message: "What is the employees last name?",
                validate: (lastName) => {
                  if (lastName) {
                    return true;
                  } else {
                    console.log("Please enter a last name for the employee");
                    return false;
                  }
                },
              },
              {
                type: "list",
                name: "role",
                message: "What is the employees role?",
                choices: titleOpt,
              },
              {
                type: "list",
                name: "manager",
                message: "Who manages this employee?",
                choices: manOptions,
              },
            ])
            .then(({ firstName, lastName, role, manager }) => {
              const query = connect.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: firstName,
                  last_name: lastName,
                  role_id: role,
                  manager_id: manager,
                },
                function (err, res) {
                  if (err) throw err;
                  console.log({ role, manager });
                }
              );
            })
            .then(() => chooseEmployee());
        });
    });
};

// update a role
const updateRole = () => {
  return connect
    .promise()
    .query("SELECT R.id, R.title, R.salary, R.department_id FROM role R;")
    .then(([roles]) => {
      let roleOptions = roles.map(({ id, title }) => ({
        value: id,
        name: title,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "Which role would you like to change?",
            choices: roleOptions,
          },
        ])
        .then((role) => {
          console.log(role);
          inquirer
            .prompt([
              {
                type: "input",
                name: "title",
                message: "Enter a title for your role.",
                validate: (roleName) => {
                  if (roleName) {
                    return true;
                  } else {
                    console.log("Please enter your role");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "salary",
                message: "What is your salary?",
                validate: (salary) => {
                  if (salary) {
                    return true;
                  } else {
                    console.log("Enter a salary.");
                    return false;
                  }
                },
              },
            ])
            .then(({ title, salary }) => {
              const query = connect.query(
                "UPDATE role SET title = ?, salary = ? WHERE id = ?",
                [title, salary, role.role],
                function (err, res) {
                  if (err) throw err;
                }
              );
            })
            .then(() => menu());
        });
    });
};

menu();
