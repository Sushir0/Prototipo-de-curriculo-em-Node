const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {isAdmin} = require('../../helpers/eAdmin')
require('../../models/Usuario')
const Usuario = mongoose.model('usuarios')


router.get('/deletar/:id', isAdmin,  (req, res)=>{
    Usuario.remove({_id: req.params.id}).then(()=>{

        
        req.flash("success_msg", "usuario deletado com sucesso")
        res.redirect('/usuarios/admin')

    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao deletar o usuário")
        res.redirect("/usuarios/admin")

    })
})


module.exports = router