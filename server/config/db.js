const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Parul1703", //database password,
  database: "full_stack", // database name
});

connection.connect((err) => {
  if (err) {
    console.log("error while connecting db");
    return;
  }
  console.log("connected to db successfully");
});


module.exports = connection;