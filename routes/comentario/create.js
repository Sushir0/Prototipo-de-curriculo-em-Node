const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Usuario')
const Usuario = mongoose.model('usuarios')
require('../../models/Postagem')
const Postagem = mongoose.model('postagens')
require('../../models/Comentario')
const Comentario = mongoose.model('comentarios')
const validar_comentario = require('../../helpers/validar_comentario')

router.get('/add/:postagem', (req, res)=>{
    if(req.isAuthenticated()){

        Postagem.findOne({_id: req.params.postagem}).then((postagem)=>{
            res.render('comentarios/add', {comentario:{
                titulo: req.body.titulo,
                conteudo: req.body.conteudo,
                postagem: postagem._id,
                usuario: req.user._id,
                postagem_titulo : postagem.titulo

            }})
        })

    }else{
        req.flash("error_msg", "precisa estar logado para comentar")
        res.redirect("/")
    }
})

router.post('/add/nova', (req, res)=>{
    if(req.isAuthenticated()){
        erros = validar_comentario.validar_edicao(req.body.titulo, req.body.conteudo)

        if(erros != null){
            res.render('comentarios/add', {postagem:{
                titulo: req.body.titulo,
                conteudo: req.body.conteudo,
                postagem: req.body.postagem,
                usuario: req.user._id,
                postagem_titulo: req.body.postagem_titulo
            }, erros: erros})

        }else{
            let novoComentario = {
                titulo: req.body.titulo,
                conteudo: req.body.conteudo,
                usuario: req.body.usuario,
                postagem: req.body.postagem

            }
            new Comentario(novoComentario).save().then(()=>{
                req.flash("success_msg", "Comentario criado com sucesso")
                
                Postagem.findOne({_id: req.body.postagem}).then((postagem)=>{
                    if(postagem){
                        res.redirect('/postagens/search/'+postagem.slug)
                    }            
                })

            }).catch((erro)=>{
                req.flash("error_msg", "erro interno ao criar a postagem")
                res.redirect("/admin")

            })
        }
    }else{
        req.flash("error_msg", "precisa estar logado para comentar")
        res.redirect("/")

    }
})





module.exports = router