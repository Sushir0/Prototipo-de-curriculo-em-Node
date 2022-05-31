const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')



router.get('/', (req, res)=>{
    res.render('usuarios/login')
})

router.post('/', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success_msg', "deslogado com sucesso!!!")
    res.redirect('/')

})

module.exports = router