"use strict";

const resetDB = require("../config/scripts/populateDB")

const Player = require("./schema/Player");
const Pick = require("./schema/Pick");

const express = require("express");
const router = express.Router();

const config = require("../config/config");
const fetch = require("node-fetch");
const updateURL = config.apiURL;

// base url
router.route("/")
    .get((req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running :)"
        });
    });

// update scores
router.route("/update")
    .get((req, res) => {
        console.log("GET /update", updateURL);
        fetch(updateURL)
            .then(response => response.json())
            .then(scores =>{
                console.log(scores);
                res.status(200).send(scores);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    });

// reset pool
router.route("/reset")
    .get((req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Pool has been reset."
            });
        });
    });

// players endpoint
router.route("/players")
    .get((req, res)  => {
        console.log("GET /players");
        Player.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    })
    .post((req, res) => {
        console.log("POST /players");
        if (!req.body.name || !req.body.email || !req.body.tiebreaker || !req.body.pick1 || !req.body.pick2 || !req.body.pick3 || !req.body.pick4 || !req.body.pick5){ 
            throw new Error("Name, email,  tiebreaker, picks required");
        }
        const newPlayer = req.body;
        newPlayer.score = 0;
        Player.create(newPlayer).save()
            .then(player => {
                console.log(player)
                res.status(201).send(player);
            })
            .catch(err => {
                console.log(err);
                res.status(400).send({
                    message: "unable to save to db"
                })
            })
    })

// individual players endpoints
router.route("/players/:id")
    .get((req, res)  => {
        console.log(`GET /players/${req.params.id}`);
        Player.findById(req.params.id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    })
    .delete((req, res) => {
        console.log(`DELETE /players/${req.params.id}`);
        Player.findOneAndDelete({_id: req.params.id})
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err =>{
            res.status(404).send(err);
        })
    })
    .patch((req, res) => {
        console.log(`PATCH /players/${req.params.id}`);
        Player.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err =>{
                res.status(404).send({
                    message: "id not found"
                });
            })
    })

// picks endpoint
router.route("/picks")
    .get((req, res)  => {
        console.log("GET /picks");
        Pick.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    })
    .post((req, res) => {
        console.log("POST /picks");
        if (!req.body.name){ 
            throw new Error("Name required");
        }
        const newPick = req.body;
        Pick.create(newPick).save()
            .then(pick => {
                console.log(pick)
                res.status(201).send(pick);
            })
            .catch(err => {
                console.log(err);
                res.status(400).send({
                    message: "unable to save to db"
                })
            })
    })

//individual picks endpoint
router.route("/picks/:id")
    .get((req, res)  => {
        console.log(`GET /picks${req.params.id}`);
        Pick.findById(req.params.id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            })
    })
    .delete((req, res) => {
        console.log(`DELETE /picks/${req.params.id}`);
        Pick.findOneAndDelete({_id: req.params.id})
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err =>{
            res.status(404).send(err);
        })
    })
    .patch((req, res) => {
        console.log(`PATCH /picks/${req.params.id}`);
        Pick.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err =>{
                res.status(404).send({
                    message: "id not found"
                });
            })
    })

//export
module.exports = router;
