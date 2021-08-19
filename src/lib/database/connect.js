
"use strict"
require("dotenv").config()
console.log(`DB NAME: ${process.env.DB_NAME}`)

const connection = require("serverless-mysql")({
    config: {
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
})

module.exports = connection
