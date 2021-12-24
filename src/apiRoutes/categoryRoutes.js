//Importing express and router
const express = require("express");
const category = require("../schemaModels/categorySchema");
const config = require("../config.json");
const jwt = require("jsonwebtoken");
const router = new express.Router();
const auth = require("../middlewares/auth")

router.post("/category",auth,(req, res)=>{
    const body= req.body;
    category.insertMany(req.body)
    .then((data) => res.status(200).send(data));
})
  
router.get("/category",auth,(req, res)=>{
    category.find({},(err,data)=>{
        if(err) res.status(404).send("No Data Found")
        else res.status(200).send(data)
    })
});

router.get("/category/:id",auth, (req, res)=>{
    id_val=req.params.id;
    category.find({_id:id_val},(err,data)=>{
        if(err) res.status(404).send("No Data Found")
        else res.status(200).send(data)
    })
});

module.exports= router;
