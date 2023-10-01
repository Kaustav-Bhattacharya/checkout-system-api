// knexfile.js
module.exports = {
    development: {
      client: 'pg',
      connection: {
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "DataBase0k!",
        port: 5432,
      },
      migrations: {
        directory: './db/migrations',
      },
      seeds: {
        directory: './db/seeds',
      },
    },
  };
  