const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Parul1703", //database password,
  database: "full_stack", // database name
});

connection.connect((err) => {
  if (err) {
    console.log("Error While Connecting Database");
    return;
  }
  console.log("onnected to Database successfully");
});


module.exports = connection;