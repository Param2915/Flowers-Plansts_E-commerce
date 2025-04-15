// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "2005", //database password,
//   database: "f&p_ecom", // database name
// });

// connection.connect((err) => {
//   if (err) {
//     console.log("Error While Connecting Database");
//     return;
//   }
//   console.log("Connected to Database successfully");
// });


// module.exports = connection;



// db.js


const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("f&p_ecom", "root", "root123456", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Set to true if you want SQL logs in the console
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Database successfully");
  } catch (error) {
    console.error("Error while connecting to the database:", error);
  }
};

connectDB();

module.exports = sequelize;
