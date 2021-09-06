require("dotenv").config();

const dbEnvironment = process.env.NODE_ENV || "development";
const configs = require("./connection")[dbEnvironment];
console.log(configs);

module.exports = configs;
