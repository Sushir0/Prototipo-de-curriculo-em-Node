const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {isAdmin} = require('../../helpers/eAdmin')
require('../../models/Usuario')
const Usuario = mongoose.model('usuarios')
const Usuario_create = require('./create')
const Usuario_edit = require('./edit')
const Usuario_login = require('./login')


router.get('/admin', isAdmin, (req, res)=>{
    Usuario.find().then((usuarios)=>{
        res.render('usuarios/admin', {usuarios: usuarios})

    }).catch((erro)=>{
        req.flash("error_msg", "houve um problema ao achar os usuarios")
        res.redirect('/admin')

    })
})


router.use ('/login', Usuario_login)
router.use ('/editar', Usuario_edit)
router.use('/create', Usuario_create)


module.exports = router