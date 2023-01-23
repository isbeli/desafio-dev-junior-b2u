const express   = require("express")
const router    = express.Router()
const validator = require("validator");
const Vehicle = require("../models/vehicle");
const middle    = require("../middlewares/authentication");//middleware

router.get("/", middle.authentication, async(req,res) => {
    try {
        const vehicle = await Vehicle.find()
        return res.status(200).send(vehicle)
    } catch (error) {
        console.log(error)
        return res.status(400).send("error getting the vehicle")
    }
});

router.post("/", middle.authentication, async(req,res)=>{
    try {
        const vehicle = await Vehicle.create(req.body)
        res.status(200).send(vehicle)
    } catch (error) {
        console.log(error)
        res.status(400).send("error adding vehicle")
    }
});

router.get("/:id", middle.authentication, async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const vehicle = await Vehicle.findById(req.params.id)
            res.status(200).send(vehicle)
        }else{
            res.status(400).send("invalid vehicle id")
        }
    
    } catch (error) {
        console.log(error)
        res.status(400).send("error getting vehicle")
    }
});

router.put("/:id", middle.authentication, async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {new: true,})
            res.status(200).send(vehicle);
        }
        else{
            res.status(400).send("invalid vehicle id")
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).send("error updating vehicle")
    }
});

router.delete("/:id", middle.authentication, async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            await Vehicle.findByIdAndDelete(req.params.id)
            res.status(200).send("deleted vehicle whit id : "+req.params.id)
        }
        else{
            res.status(400).send("invalid vehicle id")
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).send("error")
    }
});

module.exports = router