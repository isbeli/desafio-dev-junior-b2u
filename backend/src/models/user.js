const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "client"
    },
    createAt: {
        type: Date,
        default: Date.now
    }

    
})

userSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password)
    return compare
}

module.exports = mongoose.model("User", userSchema);