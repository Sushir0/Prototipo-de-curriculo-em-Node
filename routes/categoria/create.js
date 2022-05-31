const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Categoria')
const Categoria = mongoose.model('categorias')
const {isAdmin} = require('../../helpers/eAdmin')
const validar_categoria = require('../../helpers/validar_categoria')

router.get('/', isAdmin, (req, res)=>{
    res.render('categorias/add')

})


router.post('/nova', isAdmin, (req, res) =>{
    var erros = validar_categoria.validar_edicao(req.body.nome, req.body.slug)
    
    if(erros != null){
        res.render('categorias/add',{categoria: {
            nome: req.body.nome,
            slug: req.body.slug,
            _id: req.body.id,
        }, erros: erros})
        
    }else{
        var novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "categoria criada com sucesso")
            res.redirect('/categorias/admin')

        }).catch((erro)=>{
            req.flash("error_msg", "houve um erro ao salvar a categoria, tente novamente")
            res.redirect('/admin')

        })
    }

})

module.exports = router