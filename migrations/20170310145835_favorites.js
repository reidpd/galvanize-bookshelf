
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table) => {
    /*
     id              │serial                   │primary key                                           │
    │book_id         │integer                  │not null references books(id) on delete cascade index │
    |user_id         │integer                  │not null references users(id) on delete cascade index │
    │created_at      │timestamp with time zone │not null default now()                                │
    │updated_at      │timestamp with time zone │not null default now() */
    table.increments('id').primary();
    table.integer('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE');
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamps(true, true);
    knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
