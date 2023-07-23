const mongoose=require("mongoose");

const productSchema=mongoose.Schema({
    title:String,
    description:String,
    price:String,
    category:String,
    rating:String,
    image:String,
    processor: String,
    memory: String,
    storage: String,
    display: String

})

const ProductModel=mongoose.model("note",productSchema);

module.exports={ProductModel};