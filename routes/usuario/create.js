const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const validar_usuario = require('../../helpers/validar_usuario')
const {isAdmin} = require('../../helpers/eAdmin')
require('../../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')



router.get('/', (req, res)=>{
    res.render('usuarios/registro')
})


router.post('/registro', (req, res)=>{
    let erros = validar_usuario.validar_edicao(req.body.nome,
        req.body.email,
        req.body.senha,
        req.body.senha2)
        

    if(erros != null){
        res.render('usuarios/registro', {usuario: {nome:req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        senha2: req.body.senha2},erros: erros})

    }else{
        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "já existe uma conta com esse email")
                res.redirect('/usuarios/registro')

            }else{
                let novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                })

                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if(erro){
                            req.flash("error_msg", "houve um erro no salvamento")
                            res.redirect('/')

                        }else{
                            novoUsuario.senha = hash

                            novoUsuario.save().then(()=>{
                                req.flash("success_msg", "cadastro efetuado com sucesso")
                                res.render('usuarios/login',{usuario: {
                                    email: req.body.email,
                                    senha: req.body.senha}})

                            }).catch((erro)=>{
                                req.flash("error_msg", "houve um erro no salvamento")
                                res.redirect('/')
                                
                            })
                        }
                    })
                })
            }
        }).catch((erro)=>{
            console.log(erro)
            req.flash("error_msg", "houve um erro interno")
            res.redirect('/')

        })   
    }
})


module.exports = router