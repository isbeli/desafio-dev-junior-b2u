const express   = require("express")
const router    = express.Router()
const User      = require("../models/user")
const Vehicle   = require("../models/vehicle")
const jwt       = require("../middlewares/jwt")
const middle    = require("../middlewares/authentication") //middleware
const validator = require('validator');

router.post("/signup",async( req, res ) => {
    try {

        const verifyUser = await User.findOne( {email: req.body.email} ).exec();

        if( validator.isLength(req.body.name, {min: 2}) ){

            if( validator.isEmail(req.body.email) ){

                if(verifyUser != undefined){

                    res.status(400).send("email exist")

                }else if( validator.isStrongPassword(req.body.password) ){

                    const result = await User.create(req.body);
                    const { password, ...user } = result.toObject();
                    const token = jwt.sign( { user: user.id } );
                    res.send({ user, token });

                }else{

                    message={
                        error: "Password invalid",
                        message:{
                            minLength: 8,
                            minLowercase: 1, 
                            minUppercase: 1, 
                            minNumbers: 1, 
                            minSymbols: 1
                        }
                    }

                    res.status(400).send(message)

                }
            }else{
                res.status(400).send("email invalid")
            }
        }else{
            res.status(400).send("name invalid")  
        }
    } catch (error) {
        res.status(500).send("error: " + error)
    }
})

router.get('/login', async (req, res) => {
    
    const [, hash] = req.headers.authorization.split(' ') 
    const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

    try {
        const user = await User.findOne({email}).exec();
    
        if (!user) {
            return res.status(400).send("Invalid username/password supplied")

        }else{
            if(user.isValidPassword(password)){
            
                const token = jwt.sign({ user: user.id })
                res.send({ user, token })
            }
            else{

                return res.status(401).send("password error") 
        
            }

        }

    } catch (error) {
        res.status(500).send(error)
    }
})

/* protected routes */

router.get('/', middle.authentication, async (req, res) => {
    const users = await User.find({},{password:0}).sort({createAt : 'desc'})
    res.json(users) 
});

router.get('/:id', middle.authentication, async (req, res) => {
    const id   = req.params.id
    const user = await User.findById(id,{password:0}) 
    res.send([
        {
            message : "getting user whit id "+id,
            user    :  user
        }
    ])
});

router.put('/:id', middle.authentication, async (req, res, next) => {
    req.user = await User.findById(req.params.id)
    next()
},save_edit("update"));

router.delete('/:id', middle.authentication, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send("User whit id:"+req.params.id+" deleted" )
});

router.get("/:id/vehicles", middle.authentication, async(req,res)=>{
    try {
        if(validator.isMongoId(req.params.id)){
            const vehicles = await Vehicle.find({owner: req.params.id})
            res.status(200).send(vehicles)
        }else{
            res.status(400).send("invalid user id")
        }
    
    } catch (error) {
        console.log(error)
        res.status(400).send("error getting vehicles")
    }
});

function save_edit(path){
    return async (req, res) => {
        let user      = req.user
        user.name     = req.body.name     || user.name;
        user.email    = req.body.email    || user.email;
        user.password = req.body.password || user.password;
        
        try {

            user = await user.save();
            
            if(path === "new"){
                res.status(200).send(`user saved successfully`)
            }

            if(path === "update"){
                res.status(200).send(`user updated successfully`)
            }
            
        } catch(error){
            res.send("error")
        }
    }
}

module.exports = router