require("dotenv").config();
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
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
  connect.query("SELECT * FROM department;", (err, results) => {
    console.table(results);
    menu();
  });
};

// choose roles
const roles = () => {
  connect.query("SELECT * FROM role;", (err, results) => {
    console.table(results);
    menu();
  });
};

// choose employees
const chooseEmployee = () => {
  connect.query(
    "SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
    (err, results) => {
      console.table(results);
      menu();
    }
  );
};

// make a new department
const newDepartment = () => {};

//  add a  role
const newRole = () => {};

// add an employee
const newEmployee = () => {};

// update a role
const updateRole = () => {};

menu();
