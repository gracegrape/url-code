const urls_table = [
  {
    originalurl: "https://github.com/",
    shorturl: "http://localhost:3001/U3KIIILpxY",
  },
  {
    originalurl:
      "https://blog.gds-gov.tech/terragrunt-in-retro-i-would-have-done-these-few-things-e5aaac451942",
    shorturl: "http://localhost:3001/-mkTFHpJBW",
  },
];

exports.seed = function (knex) {
  return knex("urls_table")
    .del()
    .then(() => {
      return knex("urls_table").insert(urls_table);
    });
};
