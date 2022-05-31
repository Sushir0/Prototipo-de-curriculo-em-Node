const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../../models/Postagem')
const Postagem = mongoose.model('postagens')
const {isAdmin} = require('../../helpers/eAdmin')
const validar_postagem = require("../../helpers/validar_postagem")


router.get("/", isAdmin, (req, res)=>{
    Categoria.find().then((categorias)=>{
        res.render("postagens/add", {categorias: categorias})

    }).catch((erro)=>{
        req.flash("error_msg", "erro ao achar as categorias")
        res.redirect("/postagens/admin")

    })
})

router.post("/nova", isAdmin, (req, res)=>{
    var erros = validar_postagem.validar_edicao(req.body.titulo,
        req.body.slug,
        req.body.descricao,
        req.body.conteudo,
        req.body.categoria)

        if(erros != null){
            Categoria.find().then((categorias)=>{
                res.render("postagens/add", {categorias: categorias, postagem:{
                    titulo: req.body.titulo,
                    slug: req.body.slug,
                    descricao: req.body.descricao,
                    conteudo: req.body.conteudo,
                }, erros: erros})

            }).catch((erro)=>{
                req.flash("error_msg", "erro ao achar as categorias")
                res.redirect("/postagens/admin")

            })
        }else{
            var novapostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria
            
            }
            new Postagem(novapostagem).save().then(()=>{
                req.flash("success_msg", "postagem criada com sucesso")
                res.redirect('/postagens/admin')

            }).catch((erro)=>{
                req.flash("error_msg", "erro interno ao criar a postagem")
                res.redirect("/admin")

            })
        }
})




module.exports = router