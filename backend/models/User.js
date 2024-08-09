const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: Array,
        required: true
    }
}, { timestamps: true })

UserSchema.statics.register = async function (name, email, password) {
    let userExits = await this.findOne({ email })
    if (userExits) {
        throw new Error("user already exits")
    }
    //create user
    let salt = await bcrypt.genSalt()
    let hashValue = await bcrypt.hash(password, salt)
    let user = await this.create({
        name,
        email,
        password: hashValue
    })
    return user
}

UserSchema.statics.login = async function (email, password) {
    let user = await this.findOne({ email });
    if (!user) {
        throw new Error('user does not exists');
    }
    let isCorrect = await bcrypt.compare(password, user.password[0])
    if (isCorrect) {
        return user;
    } else {
        throw new Error('Password incorrect');
    }
}


module.exports = mongoose.model("User", UserSchema)