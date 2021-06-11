"use strict";

const Player = require("../../src/schema/Player");
const Pick = require("../../src/schema/Pick");
const data = require("../data.json");
require("dotenv").config();

const env = process.env;

const config = require("../config");
const mongoose = require("mongoose");


const populate = (callback) => {
    mongoose.connect(config.database, config.mongoConfig, err => {
        if (err) {
            console.log("Could not connect to database.");
        }
        const schemas = [ Player , Pick ];
        Promise
            .all(
                schemas.map(schema => schema.deleteMany())
            )
            .then(() => {
                return Player.insertMany(data.players);
            })
            .then(() => {
                return Pick.insertMany(data.picks);
            })
            .catch(err => {
                console.log(err);
                process.exit(1);
            })
            .finally(() => {
                if (callback) {
                    callback();
                } else {
                    console.log('Exiting');
                    process.exit(0);
                }
            });
    });
};

module.exports = populate;