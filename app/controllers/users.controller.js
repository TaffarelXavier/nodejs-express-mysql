const bcrypt= require('bcryptjs');
const usersModel = require("../models/users.model");
const tokenLib = require("../lib/token.lib")


module.exports = {

    // Create and Save a new Users
    create: (req, res) => {

        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Create a Users
        const users = new usersModel({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
            datecreate: true
        });

        console.log(users);
        // Save Users in the database
        usersModel.insert(users, (err, data) => {
            if (err)
                res.status(500).send({
                    error: true,
                    message:
                        err.message || "Some error occurred while creating the Users."
                });
            else
                res.status(200).send({
                    error: false,
                    data: data
                });
        });
    },

    // Create and Save a new Users
    login: (req, res) => {

        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Save Users in the database
        usersModel.findUserEmail(req.body.email, (err, data) => {
            if (err){
                res.status(500).send({
                    error: true,
                    message:
                        err.message || "Some error occurred while creating the Users."
                });
            } else if (!data) {
                return res.status(401).json({
                    error: true,
                    message: "Invalid email or password"
                });

            } else {
                console.log(req.body.password);
                console.log(data.password)
                const r = bcrypt.compareSync(req.body.password, data.password);
                if (r) {
                    let token = tokenLib.create(data.id);
                    return res.status(201).json({
                        error: false,
                        message: "Login successfully",
                        token: token
                    })
                } else {
                    return res.status(401).json({
                        error: true,
                        message: "Invalid email or password"
                    })
                }
            }
        });
    },

    // Retrieve all Customers from the database.
    findAll: (req, res) => {
        usersModel.getAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving customers."
                });
            else res.send(data);
        });
    },

    // Find a single Users with a customerId
    findOne: (req, res) => {
        usersModel.findById(req.params.id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Customer with id ${req.params.customerId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving Users with id " + req.params.customerId
                    });
                }
            } else res.send(data);
        });
    },

    // Update a Users identified by the customerId in the request
    update: (req, res) => {
        // Validate Request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        console.log(req.body);

        usersModel.updateById(
            req.params.id, new usersModel(req.body), (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Customer with id ${req.params.customerId}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Users with id " + req.params.customerId
                        });
                    }
                } else res.send(data);
            }
        );
    },

    // Delete a Users with the specified customerId in the request
    delete: (req, res) => {
        usersModel.remove(req.params.customerId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Customer with id ${req.params.customerId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Could not delete Users with id " + req.params.customerId
                    });
                }
            } else res.send({message: `Customer was deleted successfully!`});
        });
    },

    // Delete all Customers from the database.
    deleteAll: (req, res) => {
        usersModel.removeAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while removing all customers."
                });
            else res.send({message: `All Customers were deleted successfully!`});
        });
    }
}
