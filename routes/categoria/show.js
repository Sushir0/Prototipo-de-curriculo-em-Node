const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Categoria')
const Categoria = mongoose.model('categorias')
const Categoria_create = require('./create')
const Categoria_edit = require('./edit')
require('../../models/Postagem')
const Postagem = mongoose.model('postagens')
const {isAdmin} = require('../../helpers/eAdmin')



router.get('/', (req, res)=>{
    Categoria.find().then((categorias)=>{
        res.render("categorias/index", {categorias: categorias})

    }).catch((erro)=>{
        req.flash("error_msg", "categorias não encontradas")
        req.redirect("/")

    })
})


router.get('/search/:slug', (req, res)=>{
    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{

        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
                res.render('categorias/postagens', {categoria: categoria, postagens: postagens})
            }).catch((erro)=>{
                req.flash("error_msg", "erro interno ao procurar as postagens desta categoria")
                res.redirect("/")
            })

        }else{
            req.flash("error_msg","esta categoria não existe")
            res.redirect('/')

        }

    }).catch((erro)=>{
        req.flash("error_msg","houve um erro interno ao carregar a página desta categoria")
        res.redirect('/')

    })
})

router.get('/admin', isAdmin, (req, res) =>{
    Categoria.find().sort({date: "desc"}).then((categorias)=>{
        res.render('categorias/admin', {categorias: categorias})

    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao listar as categorias")
        res.redirect("/admin")

    })
})




router.use('/add',Categoria_create)
router.use('/editar', Categoria_edit)

module.exports = router