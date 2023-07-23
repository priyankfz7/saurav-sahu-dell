const bcrypt=require("bcrypt")

const jwt=require("jsonwebtoken");

require("dotenv").config();

const {UserModel}=require("../models/User.model")

const express=require("express");

const userRouter=express.Router();

userRouter.use(express.json());    


userRouter.post("/register",async (req,res)=>{
    const {name,email,pass}=req.body;
    try{
        bcrypt.hash(pass, 5, async(err,secure_password)=>{
            try{
                const user=new UserModel({name,email,pass:secure_password});
                await user.save();
                res.send(true);
            }catch(err){
                console.log(err)
                res.send(false)
            }
        });
    }catch(err){
        res.send(false);
        console.log(err)
    }
})

userRouter.post("/login",async (req,res)=>{
    const {email,pass}=req.body;
    try{
        const user=await UserModel.find({email});
        const hashed_pass=user[0].pass
        if(user.length>0){
            bcrypt.compare(pass, hashed_pass,(err,result)=>{
                if(result){
                    var token = jwt.sign({ userID:user[0]._id }, process.env.key);
                    res.send({"msg":true,"token":token});

                }else{
                    res.send({"msg":false});
                    console.log(err);
                }
            });
        }
        // console.log(user)
    }catch(err){
        res.send({"msg":false});
        console.log(err)
    }
})

userRouter.get("/data",(req,res)=>{
    const token=req.headers.authorization;
    // console.log(token)
    jwt.verify(token, process.env.key, (err,decode)=>{
        if(err){
            res.send("Invalid Token")
        }else{
            res.send("Data Page")
        }
    })
})

userRouter.get("/cart",(req,res)=>{
    const token=req.headers.authorization;
    // console.log(token)
    jwt.verify(token, process.env.key, (err,decode)=>{
        if(err){
            res.send("Invalid Token")
        }else{
            
            res.send("Cart Page")
        }
    })
})

module.exports={userRouter};