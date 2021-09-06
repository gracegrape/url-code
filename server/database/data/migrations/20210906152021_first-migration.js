exports.up = (knex) => {
  return knex.schema.createTable("urls_table", function (table) {
    table.string("originalurl").notNullable().primary();
    table.string("shorturl").notNullable().unique();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists("urls_table");
};
