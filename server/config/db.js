const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("full_stack", "root", "@Parul1703", {
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
