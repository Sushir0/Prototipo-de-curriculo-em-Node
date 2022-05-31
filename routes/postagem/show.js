const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Categoria')
const Categoria = mongoose.model('categorias')
const Postagem_create = require('./create')
const Postagem_edit = require('./edit')
require('../../models/Postagem')
const Postagem = mongoose.model('postagens')
require('../../models/Comentario')
const Comentario = mongoose.model('comentarios')
const {isAdmin} = require('../../helpers/eAdmin')


router.get('/search/:slug', (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            
            Comentario.find({postagem: postagem._id}).populate(('usuario')).then((comentarios)=>{
                res.render("postagens/search", {postagem: postagem, comentarios: comentarios})
            }).catch((erro)=>{
                req.flash("error_msg", "erro interno ao procurar os comentarios")
                res.redirect('/')    
            })
                

        }else{
            req.flash("error_msg", "essa postagem não existe")
            res.redirect('/')

        }
    }).catch((erro)=>{

        req.flash("error_msg", "houve um erro interno")
        res.redirect('/')
    })
})

router.get("/admin", isAdmin, (req, res)=>{

    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens)=>{
        res.render('postagens/admin', {postagens: postagens})

    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao mostrar as postagens")
        res.redirect('/admin')
    })
})






router.use('/add', Postagem_create)
router.use('/editar', Postagem_edit)


module.exports = router