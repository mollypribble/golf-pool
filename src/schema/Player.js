"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    tiebreaker: {
        type: Schema.Types.Number,
        required: true
    },
    pick1: {
        type: Schema.Types.String,
        required: true
    },
    pick2: {
        type: Schema.Types.String,
        required: true
    },
    pick3: {
        type: Schema.Types.String,
        required: true
    },
    pick4: {
        type: Schema.Types.String,
        required: true
    },
    pick5: {
        type: Schema.Types.String,
        required: true
    },
    // picks: [{
    //     type: Schema.Types.ObjectId, 
    //     ref: "Pick"
    // }],
    score: {
        type: Schema.Types.Number
    }
    // player_id: {
    //     type: Schema.Types.String
    // }
});

PlayerSchema.statics.create = function(obj) {
    const Player = mongoose.model("Player", PlayerSchema);
    const player = new Player();
    player.name = obj.name;
    player.email = obj.email;
    player.tiebreaker = obj.tiebreaker;
    player.pick1 = obj.pick1;
    player.pick2 = obj.pick2;
    player.pick3 = obj.pick3;
    player.pick4 = obj.pick4;
    player.pick5 = obj.pick5;
    player.score = obj.score;
    // player.picks  = obj.picks;
    // player.player_id = obj.player_id;
    return player;
}

module.exports = mongoose.model("Player", PlayerSchema);