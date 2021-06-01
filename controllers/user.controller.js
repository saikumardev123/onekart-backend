const bcrypt = require('bcrypt');

const userModel = require('../models/user.model');


exports.register = async (req, res) => {

    var user =  {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password,10),
        email: req.body.email,
    };

    let document = new userModel(user);

    try {
        let doc = await document.save();
        if (doc)
            res.status(201).send({ success: true, message: "Registered successfully!" });
        else
            res.status(404).send({ success: false, message: "Something went wrong" });

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}