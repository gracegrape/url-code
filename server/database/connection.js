const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: "5432",
  password: "postgres",
  database: "url_shortener",
});

// client.connect();

// client.query("SELECT * FROM public.url_table", (err, res) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(res.rows);
//   }

//   client.end;
// });

module.exports = client;
