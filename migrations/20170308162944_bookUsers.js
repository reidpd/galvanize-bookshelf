
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (table) => {
      /*
      first_name      │varchar(255)             │not null default ''    │
      │last_name       │varchar(255)             │not null default ''    │
      │email           │varchar(255)             │not null unique        │
      |hashed_password |char(60)                 │not null               │
      │created_at      │timestamp with time zone │not null default now() │
      │updated_at      │timestamp with time zone │not null default now()
      */
      table.increments('id').primary();
      table.string('first_name').notNullable().defaultTo('');
      table.string('last_name').notNullable().defaultTo('');
      table.string('email').notNullable().unique();
      table.specificType('hashed_password', 'char(60)').notNullable();
      table.timestamps(true, true);
      knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));");
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
