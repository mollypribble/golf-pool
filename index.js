"use strict";

const express = require('express')
const app = express();

require("dotenv").config();
const env = process.env;

const bodyConfig = {
    limit: "10mb",
    extended: true
};
app.use(express.urlencoded(bodyConfig));
app.use(express.json(bodyConfig));

const middleware = require("./config/middleware");
app.use(middleware.cors);
app.use(express.static('public'));

const config = require("./config/config");
const mongoose = require("mongoose");

mongoose.connect(config.database, config.mongoConfig, err => {
    if (err) {
        console.log("Could not connect to database.");
        console.log(err);
    } else {
        console.log(`Connected to ${env.DB_NAME}.`);
    }
});

const routes = require("./src/routes");
app.use("", routes);

const PORT = env.PORT || 8000;
app.listen(PORT);
console.log("Application listening on PORT: " + PORT);
console.log("http://localhost:" + PORT);

module.exports = app;
