//carregando módulos
    const express = require('express')
    const app = express()
    const { engine } = require ('express-handlebars');
    const bodyparser = require('body-parser')
    const mongoose = require('mongoose')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    require('./models/Comentario')
    const Comentario = mongoose.model('comentarios')
    const bcrypt = require('bcryptjs')
    const passport = require('passport')
    require ('./config/auth')(passport)
    const db = require('./config/db')
    const Categoria_show = require('./routes/categoria/show')
    const Postagem_show = require('./routes/postagem/show')
    const Usuario_show = require('./routes/usuario/show')
    
    const Comentario_create = require('./routes/comentario/create')
    const Comentario_edit = require('./routes/comentario/edit')
    
    const {isAdmin} = require('./helpers/eAdmin')
    

//configurando módulos
    //sessão
        app.use(session({
            secret: "qualquer coisa",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    //midleware
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })

    //bodyparser
        app.use(bodyparser.urlencoded({extended: true}))
        app.use(bodyparser.json())

    //handlebars
        app.engine('handlebars', engine({defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }}))
        app.set('view engine', 'handlebars')
        

    //mongoose
    console.log('link de conexão: '+ db.mongoURI)
        mongoose.promise = global.promise
        mongoose.connect(db.mongoURI).then(()=>{
            console.log('banco conectado')
        }).catch((erro)=>{
            console.log('erro: '+erro)
        })
    

    //public
    app.use(express.static(path.join(__dirname+"public")))

    //



//rotas
app.get('/', (req, res)=>{

    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render("index", {postagens: postagens})    
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/404")
    })
})

app.get('/404', (req, res)=>{
    res.send("erro 404!")
})

app.get('/admin', isAdmin, (req,  res)=>{
    res.render('admin')
})

app.post('/search', (req, res)=>{
    if(!req.body.search || typeof req.body.search == undefined || req.body.search == null){
        req.flash("error_msg", 'pesquisa nula')
        res.redirect('/')
    }else{
        res.redirect('/search/'+req.body.search)
    }
    
})

app.get('/search/:search', (req, res)=>{

    let pesquisa_minuscula = req.params.search.toLowerCase()

    Categoria.find().then((categorias)=>{
        Postagem.find().then((postagens)=>{
            Comentario.find().populate('postagem').then((comentarios)=>{

                let categorias_encontradas = []
                for(let i=0;i<categorias.length;i++){
                    let nome_categoria_minuscula = categorias[i].nome.toLowerCase()

                    if(nome_categoria_minuscula.indexOf(pesquisa_minuscula) != -1){
                        categorias_encontradas.push(categorias[i])

                    }
                }
                

                let postagens_encontradas = []
                for(let i=0;i<postagens.length;i++){
                    let titulo_postagem_minuscula = postagens[i].titulo.toLowerCase()
                    let descricao_postagem_minuscula = postagens[i].descricao.toLowerCase()
                    let conteudo_postagem_minuscula = postagens[i].conteudo.toLowerCase()

                    if(titulo_postagem_minuscula.indexOf(pesquisa_minuscula) != -1 ||
                    descricao_postagem_minuscula.indexOf(pesquisa_minuscula) != -1 ||
                    conteudo_postagem_minuscula.indexOf(pesquisa_minuscula) != -1){
                        postagens_encontradas.push(postagens[i])

                    }
                }


                let comentarios_encontrados = []
                for(let i=0;i<comentarios.length;i++){
                    let titulo_comentario_minusculo = comentarios[i].titulo.toLowerCase()
                    let conteudo_comentario_minusculo = comentarios[i].conteudo.toLowerCase()

                    if(titulo_comentario_minusculo.indexOf(pesquisa_minuscula) != -1 ||
                    conteudo_comentario_minusculo.indexOf(pesquisa_minuscula) != -1){
                        if(comentarios[i].postagem == null){
                            console.log(comentarios[i])
                        }else{
                            comentarios_encontrados.push(comentarios[i])    
                        }

                    }
                }
                res.render('search', {categorias: categorias_encontradas, 
                    postagens: postagens_encontradas,
                    comentarios: comentarios_encontrados})

            }).catch((erro)=>{
                req.flash("error_msg", "houve um erro interno")
                res.redirect("/")

            })
        }).catch((erro)=>{
            req.flash("error_msg", "houve um erro interno")
            res.redirect("/")

        })
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/")

    })
})


app.use('/comentarios/create', Comentario_create)
app.use('/comentarios/editar', Comentario_edit)
app.use('/usuarios', Usuario_show)
app.use('/postagens', Postagem_show)
app.use('/categorias', Categoria_show)

//outros
    const porta =  process.env.PORT || 8081
    app.listen(porta, ()=>{
        console.log('servidor rodando na url: localhost:'+porta)
    })