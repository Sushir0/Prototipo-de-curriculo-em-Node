const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../../models/Usuario')
const Usuario = mongoose.model('usuarios')
require('../../models/Postagem')
const Postagem = mongoose.model('postagens')
require('../../models/Comentario')
const Comentario = mongoose.model('comentarios')
const {isAdmin} = require('../../helpers/eAdmin')




router.get('/admin/search/:slug', isAdmin, (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            
            Comentario.find({postagem: postagem._id}).populate(('usuario')).then((comentarios)=>{
                res.render("comentarios/admin", {postagem: postagem, comentarios: comentarios})
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

router.get('/deletar/:id', isAdmin, (req, res)=>{

    Comentario.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg", "Comentário deletado com sucesso")
        res.redirect('/postagens/admin')

    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao deletar o comentário")
        res.redirect('/postagens/admin')

    })
})





module.exports = router