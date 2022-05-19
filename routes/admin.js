const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {isAdmin} = require('../helpers/eAdmin')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')


router.get('/', isAdmin, (req,  res)=>{
    res.render('admin/index')
})

router.get('/posts', isAdmin, (req, res) =>{
    res.send('página de posts')
})
 
router.get('/categorias', isAdmin, (req, res) =>{
    Categoria.find().sort({date: "desc"}).then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao listar as categorias")
        res.redirect("/admin")
    })

})

router.post('/categorias/edit', isAdmin, (req, res)=>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome inválido"})
    }
    if(erros.length>0){
        res.render('admin/editcategorias', {categoria: {
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
                res.redirect('/admin/categorias')
            }).catch((erro)=>{
                req.flash("error_msg", "houve um erro interno ao salvar a edição da categoria")
                res.redirect('/admin/categorias')
            })
        })
    }
})

router.get('/categorias/deletar/:id', isAdmin, (req, res)=>{
    Categoria.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect('/admin/categorias')
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao deletar a categoria")
        res.redirect('admin/categorias')

    })
})

router.get('/categorias/edit/:id', isAdmin, (req, res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})    
    }).catch((erro)=>{
        req.flash("error_msg", "categoria não existe")
        res.redirect("/admin/categorias")
    })
})

router.get('/categorias/add', isAdmin, (req, res)=>{
    res.render('admin/addcategoria')
})
router.post('/categorias/nova', isAdmin, (req, res) =>{

    var erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome inválido"})
    }
    qtdespaco =  req.body.slug.split(" ").length
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null || qtdespaco>1){
        erros.push({texto: "slug inválido"})
    }
    if(erros.length>0){
        res.render('admin/addcategoria',{categoria: {
            nome: req.body.nome,
            slug: req.body.slug,
            _id: req.body.id,
        }, erros: erros})
        
    }else{
    Categoria.findOne({slug: req.body.slug}).then((categoria)=>{
        if(categoria){
            erros.push({texto: "slug já existente"})
            res.render('admin/addcategoria',{categoria: {
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
                res.redirect('/admin/categorias')
            }).catch((erro)=>{
                req.flash("error_msg", "houve um erro ao salvar a categoria, tente novamente")
                res.redirect('/admin')
            })
        }
    }).catch((erro)=>{
        req.flash('error_msh', "houve um erro interno ao salvar a categoria")
        res.redirect('/admin')
    })
    }

})

router.get("/postagens", isAdmin, (req, res)=>{

    Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens})
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao mostrar as postagens")
        res.redirect('/admin')
    })
})

router.get("/postagens/add", isAdmin, (req, res)=>{
    Categoria.find().then((categorias)=>{
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((erro)=>{
        req.flash("error_msg", "erro ao achar as categorias")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagens/nova", isAdmin, (req, res)=>{
    var erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "titulo inválido"})
    }
    Postagem.find({slug: req.body.slug}).then((postagens)=>{
        if(postagens.length>0){
            erros.push({texto: "slug já usado"})
        }
        qtdespaco =  req.body.slug.split(" ").length
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null || qtdespaco>1){
            erros.push({texto: "slug inválido"})
        }
        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null ){
            erros.push({texto: "descrição inválida"})
        }
        if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
            erros.push({texto: "conteúdo inválido"})
        }
        if(!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == "0"){
            erros.push({texto: "categoria inválida"})
        }
        if(erros.length>0){
            Categoria.find().then((categorias)=>{
                res.render("admin/addpostagem", {categorias: categorias, postagem:{
                    titulo: req.body.titulo,
                    slug: req.body.slug,
                    descricao: req.body.descricao,
                    conteudo: req.body.conteudo,
                }, erros: erros})
            }).catch((erro)=>{
                req.flash("error_msg", "erro ao achar as categorias")
                res.redirect("/admin/postagens")
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
                res.redirect('/admin/postagens')
            }).catch((erro)=>{
                req.flash("error_msg", "erro interno ao criar a postagem")
                res.redirect("/admin")
            })
        }
    
    }).catch((erro)=>{
        req.flash("error_msg", "erro interno ao verificar slug da postagem")
        res.redirect("/admin/postagens/add")
    })
    

})

router.get('/postagens/edit/:id', isAdmin, (req, res)=>{
    Postagem.findOne({_id:req.params.id}).then((postagem)=>{

        Categoria.find().then((categorias)=>{
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
        })
    }).catch((erro)=>{
        req.flash("error_msg", "postagem não contrada")
        res.redirect("/admin/postagens")
    })
})

router.post('/postagens/edit', isAdmin, (req, res)=>{
    var erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "titulo inválido"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null ){
        erros.push({texto: "descrição inválida"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ){
        erros.push({texto: "slug inválido"})
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "conteúdo inválido"})
    }
    if(!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == "0"){
        erros.push({texto: "categoria inválida"})
    }
    if(erros.length>0){
        Categoria.find().then((categorias)=>{
            res.render("admin/addpostagem", {categorias: categorias, postagem:{
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                slug: req.body.slug,
                conteudo: req.body.conteudo,
            }, erros: erros})
        }).catch((erro)=>{
            req.flash("error_msg", "erro ao achar as categorias")
            res.redirect("/admin/postagens")
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
                res.redirect('/admin/postagens')
            }).catch((erro)=>{
                req.flash("error_msg", "houve um erro interno ao salvar a edição da postagem")
                res.redirect('/admin/postagens')
            })
        })
    }
})

router.get('/postagens/deletar/:id', isAdmin,  (req, res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg", "postagem deletada com sucesso")
        res.redirect('/admin/postagens')
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao deletar a postagem")
        res.redirect("/admin/postagens")
    })
})

router.get('/usuarios', isAdmin, (req, res)=>{
    Usuario.find().then((usuarios)=>{
        res.render('admin/usuarios', {usuarios: usuarios})
    }).catch((erro)=>{
        req.flash("error_msg", "houve um problema ao achar os usuarios")
        res.redirect('/admin')
    })
})




module.exports = router