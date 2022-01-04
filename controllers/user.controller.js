const express = require("express");
const User= require("../models/user.model");
const router= express.Router();
const transporter= require('../config/mail')
var jwt = require('jsonwebtoken');
require('dotenv').config()

const newToken =(user)=>{
    return  jwt.sign({ user:user }, process.env.JsonWebToken);
}


router.post('/createaccount', async function (req, res) {


        let user;
    try{
        user= await User.findOne({ email: req.body.email}).lean().exec()
        if(user) {
            return res.status(400).json({ 
                status:"failed",
                message: 'Email already exists'
            })
        }

        user= await User.create(req.body)
        const token = newToken(user);
        return res.cookie('token', token).json({user})
    }
    
     catch (e) {
        res.status(500).send({
            message:e.message
        })

    }

})

router.post('/login', async function (req, res) {

    try {
        let user
        user= await User.findOne({ email: req.body.email});
        if(!user) {
           return res.status(400).json({ 
                status:"failed",
                message: "Email dont exists"
            })
        }
        const match = await user.checkPassword(req.body.password);
        if(!match){
            return res.status(400).json({ 
                status:"failed",
                message: "Password not correct"
        })
    }
    const token = newToken(user);
    return res.cookie('token', token).json({user})

    } catch (e) {
        res.status(500).json({
            status: e,
            message:e
        })
    }

})

router.get('/user/logout', async function (req, res) {

    try {
    return res.cookie('token', "").json("successful");
    } catch (e) {
        console.log('e:', e)
        res.status(500).json({
            message:e
        })
    }

})




module.exports=router;