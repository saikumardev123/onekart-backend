const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv= require('dotenv');

const userModel = require('../models/user.model');
const emailService = require('../services/EmailService');

dotenv.config();

exports.register = async (req, res) => {

    var user = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
        
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
                var payload= {subject: user._id}
                 var token = jwt.sign(payload,process.env.JWT_SECRET);
                res.status(200).send({ success: true,token:token, _id:user._id,message: "Login success!" });
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

exports.forgotPassword =  async (req, res) => {

    try {
        let user = await userModel.findOne({ email: req.body.email});
        if (user) {
                 emailService.sendEmail({ 
                     to: req.body.email,
                     subject : "Email Reset",
                     html: `
                            <a href="http://www.facebook.com">Password reset link</a>
                     `
                    })
                res.status(200).send({ success: true,message: "password reset link has been shared to your email" });
            }
            else {
                res.status(404).send({ success: true, message: "Email Not found" });
            }

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}

   
exports.updateRole = async (req, res) => {
  
     console.log(req.body);

      

    try {
        console.log("_id",req.body._id);
        let user= await userModel.findOne({_id:req.body._id});
        console.log('user',user);
         if(user.isAdmin){
            let updatedUser = await userModel.findByIdAndUpdate(req.body.target_id,{isAdmin:req.body.isAdmin}, {new:true});
            if (updatedUser) {
                    res.status(200).send({ success: true, message: "role updated successfully!" });
                }
                else {
                    res.status(404).send({ success: true, message: "user Not found" });
                }
         }
         else
         {
             res.status(401).send({success:false, message:"Unauthorized operation"});
         }
        
        

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }

}
