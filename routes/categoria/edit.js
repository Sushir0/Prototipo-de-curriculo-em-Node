const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Categoria')
const Categoria = mongoose.model('categorias')
const {isAdmin} = require('../../helpers/eAdmin')
const validar_categoria = require('../../helpers/validar_categoria')
require('../../models/Postagem')
const Postagem = mongoose.model('postagens')



router.get('/admin/search/:slug', isAdmin, (req, res)=>{

    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{

        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
                res.render('categorias/admin_postagens', {categoria: categoria, postagens: postagens})
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

router.get('/search/:id', isAdmin, (req, res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('categorias/editar', {categoria: categoria})
            
    }).catch((erro)=>{
        req.flash("error_msg", "categoria não existe")
        res.redirect("/categorias/admin")

    })
})

router.post('/edit',  isAdmin, (req, res)=>{
    var erros = validar_categoria.validar_edicao(req.body.nome, req.body.slug)

    if(erros != null){
        res.render('categorias/editar', {categoria: {
            nome: req.body.nome,
            slug: req.body.slug,
            _id: req.body.id,
        }, erros: erros})   

    }else{
        Categoria.findOne({_id:req.body.id}).then((categoria)=>{
                        
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(()=>{
                req.flash("success_msg", "categoria editada com sucesso")
                res.redirect('/categorias/admin')

            }).catch((erro)=>{
                req.flash("error_msg", "houve um erro interno ao salvar a edição da categoria")
                res.redirect('/categorias/admin')

            })
        })
    }
})

router.get('/deletar/:id', isAdmin, (req, res)=>{

    Categoria.remove({_id: req.params.id}).then(()=>{

        Postagem.remove({categoria: req.params.id}).then(()=>{
            req.flash("success_msg", "postagens deletadas com sucesso")
    
        }).catch((erro)=>{
            req.flash("error_msg", "houve um erro ao deletar as postagens")
    
        })
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect('/categorias/admin')

    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao deletar a categoria")
        res.redirect('categorias/admin')

    })
})





module.exports = router