const mongoose = require("mongoose");
const Schema   = mongoose.Schema

const vehicleSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    brand: {
        type: String,
        required: true,
    },

    year: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    createAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Vehicle", vehicleSchema);