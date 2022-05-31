const { default: mongoose } = require("mongoose");

const Mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Comentario = new Schema({
    titulo: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    postagem: {
        type: Schema.Types.ObjectId,
        ref: "postagens",
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("comentarios", Comentario)