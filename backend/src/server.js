require('dotenv/config');
const express = require('express'); 
const app = express();
const mongoose = require('mongoose');

const routerUser = require("./routes/user");
const routerVehicle = require("./routes/vehicle");

/*server port */
const port = process.env.PORT || 5000;

/* Connection MongoDB*/
const mongoUrl = process.env.MONGO_DB;

mongoose.set("strictQuery", false);

mongoose.connect(mongoUrl)
        .then(() => { 
            console.log('Database connection successful')
        })
        .catch(err => {
            console.error('Database connection error')
        });

/* Accept form and json formats */
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

/* routes */
app.get('/',(req, res) => {
    res.send(`<h1>Server is on</h1>`)
});

app.use("/user",routerUser);
app.use("/vehicle",routerVehicle);

app.listen(port, () => {
    console.log('Server running on port ' + port)
});