require("dotenv").config();
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");

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
      }
    });
};

// choose departments
const departments = () => {};

// choose roles
const roles = () => {};

// choose employees
const chooseEmployee = () => {};

// make a new department
const newDepartment = () => {};

//  add a  role
const newRole = () => {};

// add an employee
const newEmployee = () => {};

// update a role
const updateRole = () => {};

menu();
