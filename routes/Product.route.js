const express=require("express");

const productRouter=express.Router();

require("dotenv").config();

const {ProductModel}=require("../models/Product.model");

productRouter.get("/",async (req,res)=>{
    const data=await ProductModel.find();
    res.send(data);
})

productRouter.post("/add",async (req,res)=>{
    console.log(req.body)
    const payload=req.body;
    try{
        const user=new ProductModel(payload);
                await user.save();
                res.send("Product Added");
    }catch(err){
        res.send("Something Went Wrong");
    }
})

productRouter.get("/single/:id",async (req,res)=>{
    const id=req.params.id
    try{
        const product=await ProductModel.findById({_id:id});
        res.send(product);
    }catch(err){
        res.send("Something Went Wrong");
        console.log(err);
    }
})

productRouter.get("/search", async (req, res) => {
    // console.log(req.query.q)
    try {
        let data=await ProductModel.find({
            "$or":[
                {title:{$regex:req.query.q,$options:"i"}},
                {description:{$regex:req.query.q,$options:"i"}}
            ]
          })
          res.send(data)
    } catch (error) {
        console.log(error)
    }
})

productRouter.patch("/edit/:id",async (req,res)=>{
    const payload=req.body;
    const id=req.params.id;
    const product=await ProductModel.findOne({"_id":id});
    const userID_in_product=product.userID;
    const userID_making_req=req.body.userID;
    try{
        // console.log(id)
        if(userID_in_product!=userID_making_req){
            res.send("You are not authorized");
        }else{
            await ProductModel.findByIdAndUpdate({_id:id},payload)
            res.send(`One product data has been updated with id: ${id}`);  
        }
    }catch(err){
        res.send("Something Went Wrong"+err);
        
    }
})

productRouter.delete("/delete/:id",async (req,res)=>{
    const id=req.params.id;
    const product=await ProductModel.findOne({"_id":id});
    const userID_in_product=product.userID;
    const userID_making_req=req.body.userID;
    try{
        if(userID_in_product!=userID_making_req){
            res.send("You are not authorized");
        }else{
        await ProductModel.findByIdAndDelete({_id:id})
        res.send(`One product data has been deleted with id: ${id}`);
        }
    }catch(err){
        res.send("Something Went Wrong"+err);
        
    }
})

module.exports={productRouter};