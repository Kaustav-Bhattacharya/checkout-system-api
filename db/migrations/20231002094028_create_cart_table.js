/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable("cart", function (table) {
        table.increments("id").primary();
        table.string("product_id").notNullable();
        table.decimal("price", 8, 2).notNullable();
        table.integer("quantity").notNullable();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable("cart");
};
