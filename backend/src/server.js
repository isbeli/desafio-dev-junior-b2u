require('dotenv/config');
const express = require('express'); 
const app = express();
const mongoose = require('mongoose');

/*server port */
const port = process.env.PORT || 5000;

/* Coneccion MongoDB*/
const mongoUrl = process.env.MONGO_DB;

mongoose.set("strictQuery", false);

mongoose.connect(mongoUrl)
        .then(() => { 
            console.log('Database connection successful')
        })
        .catch(err => {
            console.error('Database connection error')
        });

app.get('/',(req, res) => {
    res.send(`<h1>Server is on</h1>`)
})

app.listen(port, () => {
    console.log('Server running on port ' + port)
});