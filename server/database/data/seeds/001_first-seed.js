const urls_table = [
  {
    originalUrl: "https://github.com/",
    shortUrl: "http://localhost:3001/U3KIIILpxY",
  },
  {
    originalUrl:
      "https://blog.gds-gov.tech/terragrunt-in-retro-i-would-have-done-these-few-things-e5aaac451942",
    shortUrl: "http://localhost:3001/-mkTFHpJBW",
  },
];

exports.seed = function (knex) {
  return knex("urls_table")
    .del()
    .then(() => {
      return knex("urls_table").insert(urls_table);
    });
};
