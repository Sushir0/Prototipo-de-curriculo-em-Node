const { default: mongoose } = require("mongoose");

const Mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome:{
        type: String,
        require: true
    },
    eAdmin:{
        type: Number,
        default: 0
    },
    email:{
        type: String,
        require: true
    },
    senha:{
        type: String,
        require: true
    }
})

mongoose.model('usuarios', Usuario)