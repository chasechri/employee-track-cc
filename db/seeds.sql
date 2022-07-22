INSERT INTO department (name)
VALUES('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES('Lawyer', 160000, 2), ('Accountant', 100000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('Nelly', 'Johnson', 2, NULL), ('Rudy', 'Gobert', 1, NULL);
