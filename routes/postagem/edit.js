const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Categoria')
const Categoria = mongoose.model('categorias')
const {isAdmin} = require('../../helpers/eAdmin')
require('../../models/Postagem')
const Postagem = mongoose.model('postagens')
require('../../models/Comentario')
const Comentario = mongoose.model('comentarios')
const validar_postagem = require("../../helpers/validar_postagem")



router.get('/search/:id', isAdmin, (req, res)=>{
    Postagem.findOne({_id:req.params.id}).then((postagem)=>{
        Categoria.find().then((categorias)=>{
            res.render("postagens/editar", {categorias: categorias, postagem: postagem})

        })
    }).catch((erro)=>{
        req.flash("error_msg", "postagem não contrada")
        res.redirect("/postagens/admin")

    })
})

router.post('/edit', isAdmin, (req, res)=>{
    var erros = validar_postagem.validar_edicao(req.body.titulo,
        req.body.slug,
        req.body.descricao,
        req.body.conteudo,
        req.body.categoria)
    
    if(erros != null){
        Categoria.find().then((categorias)=>{
            res.render("postagens/add", {categorias: categorias, postagem:{
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                slug: req.body.slug,
                conteudo: req.body.conteudo,
            }, erros: erros})

        }).catch((erro)=>{
            req.flash("error_msg", "erro ao achar as categorias")
            res.redirect("/postagens/admin")
        })

    }else{
        Postagem.findOne({_id:req.body.id}).then((postagem)=>{
            
            postagem.titulo = req.body.titulo
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.slug = req.body.slug
            postagem.categoria = req.body.categoria

            postagem.save().then(()=>{
                req.flash("success_msg", "postagem editada com sucesso")
                res.redirect('/postagens/admin')

            }).catch((erro)=>{
                req.flash("error_msg", "houve um erro interno ao salvar a edição da postagem")
                res.redirect('/postagens/admin')

            })
        })
    }
})

router.get('/deletar/:id', isAdmin,  (req, res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{

        Comentario.remove({postagem: req.params.id}).then(()=>{
            req.flash("success_msg", "Comentários deletados com sucesso")
    
        }).catch((erro)=>{
            req.flash("error_msg", "houve um erro ao deletar os comentários")            
    
        })

        req.flash("success_msg", "postagem deletada com sucesso")
        res.redirect('/postagens/admin')

    }).catch((erro)=>{
        console.log(erro)
        req.flash("error_msg", "houve um erro ao deletar a postagem")
        res.redirect("/postagens/admin")

    })
})






module.exports = router