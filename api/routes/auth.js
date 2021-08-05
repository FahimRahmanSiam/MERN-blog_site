const router=require('express').Router();
const User=require('../models/Users');
const bcrypt=require('bcrypt');

//register
router.post("/register",async(req,res)=>{
    try {
        //const newUser=new User(req.body); (this will be used if we want all of the data)
        //encrypts the user password
        const salt=await bcrypt.genSalt(10);
        const hashedPass=await bcrypt.hash(req.body.password,salt);
        const newUser=new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass, //sends the encrypted password to the user
        });
        const user=await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error)
    }
});

//login
router.post("/login",async(req,res)=>{
    try {
        const user=await User.findOne({username: req.body.username});
        !user && res.status(400).json("Wrong username!");
        //now compare the encrypted password in the database with the given password
        const validate=await bcrypt.compare(req.body.password,user.password);
        !validate && res.status(400).json("Wrong password!");
        //we dont want to send the user the password,so we do this...
        const {password,...others}=user._doc;
        res.status(200).json(others);

    } catch (error) {
        res.status(500).json(error)
    }
});

module.exports=router