const mongoose = require('mongoose')

class Database {
  static connect () {
    mongoose
      .connect(
        process.env.DATABASE_URL,
        {
          dbName: process.env.DATABASE_NAME
        }
      )
      .then(() => {
        console.log('Database connection is ready! 🚀')
      })
      .catch((error) => {
        console.log('An error ocurred trying to connect to the database')
        console.log(error)
      })
  }
}

module.exports = {
  Database
}
