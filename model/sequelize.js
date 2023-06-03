const dbConfig = require("../config/mysql");

const Sequelize = require("sequelize");

const connection = new Sequelize({
  dialect: 'postgres',
  host: process.env.MYSQL_HOSTNAME,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // port: 3307,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: (() => {
    let opts = {
      charset: 'utf8mb4',
    }
    return opts
  })(),
  define: {
    updatedAt: false,
    underscored: false
  },
  logging: false
});

connection.authenticate()
  .then(() => {
    console.log('Connected to database')
    connection.sync({ alter: true })
      .then((result) => null).catch((err) => null);
  })
  .catch((err) => {
    console.log('Error while connecting database', err)
  });


module.exports = connection
