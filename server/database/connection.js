const pg = require("pg");

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = { rejectUnauthorized: false };
}

// const client = new pg.Client({
//   host: "localhost",
//   user: "postgres",
//   password: "postgres",
//   database: "url_shortener",
// });

const dbConns = {
  development: {
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
  },
  production: {
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
  },
};

module.exports = dbConns;
