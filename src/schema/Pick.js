"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PickSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    day1: {
        type: Schema.Types.Number
    },
    day2: {
        type: Schema.Types.Number
    },
    day3: {
        type: Schema.Types.Number
    },
    day4: {
        type: Schema.Types.Number
    },
    total: {
        type: Schema.Types.Number
    },
    // radar_id: {
    //     type: Schema.Types.Number
    // }
    // pick_id: {
    //     type: Schema.Types.String
    // }
});

PickSchema.statics.create = function(obj) {
    const Pick = mongoose.model("Pick", PickSchema);
    const pick = new Pick();
    pick.name = obj.name;
    pick.day1 = obj.day1;
    pick.day2 = obj.day2;
    pick.day3 = obj.day3;
    pick.day4  = obj.day4;
    pick.total = obj.total;
    // pick.radar_id = obj.radar_id;
    // pick.pick_id = obj.pick_id;
    return pick;
}

module.exports = mongoose.model("Pick", PickSchema);