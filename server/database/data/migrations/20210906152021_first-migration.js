exports.up = (knex) => {
  return knex.schema.createTable("urls_table", function (table) {
    table.string("originalUrl").notNullable().primary();
    table.string("shortUrl").notNullable().unique();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists("urls_table");
};
