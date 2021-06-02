const bcrypt = require('bcrypt');

const userModel = require('../models/user.model');


exports.register = async (req, res) => {

    var user = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
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

exports.login = async (req, res) => {

    try {
        let user = await userModel.findOne({ username: req.body.username });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.status(200).send({ success: true, message: "Login success!" });
            }
            else {
                res.status(401).send({ success: true, message: "Password incorrect" });
            }
        }

        else
            res.status(404).send({ success: false, message: "user not found" });

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}

exports.changePassword = async (req, res) => {
    try {
        let user = await userModel.findOne({ username: req.body.username });
        if (user) {
            if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
                let updatedUser = await userModel.findOneAndUpdate({ username: req.body.username }, { password: bcrypt.hashSync(req.body.newPassword, 10) },{new:true});
                if (updatedUser) {
                    if (bcrypt.compareSync(req.body.newPassword, updatedUser.password)) {
                        res.status(200).send({ success: true, message: "password changed!" });
                    }
                    else {
                        res.status(500).send({ success: false, message: "Something went wrong!!" });
                    }
                }
                else {
                    res.status(401).send({ success: false, message: "failed in updating password " });
                }
            }
            else {
                res.status(401).send({ success: true, message: "Current Password incorrect" });
            }
        }

        else
            res.status(404).send({ success: false, message: "user not found" });

    } catch (error) {
        console.log("inside catch block")
        console.log(error);
        return res.status(500).send({ success: false, message: error.message })
    }
}

//$2b$10$Xmn5xA552FjOwiTVIwxRT.jFAUCzi4Qzr5hZdZnxsKPNcUqjc8lRy

// $2b$10$Xmn5xA552FjOwiTVIwxRT.jFAUCzi4Qzr5hZdZnxsKPNcUqjc8lRy