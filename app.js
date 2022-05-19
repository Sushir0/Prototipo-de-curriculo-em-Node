//carregando módulos
    const express = require('express')
    const app = express()
    const { engine } = require ('express-handlebars');
    const bodyparser = require('body-parser')
    const mongoose = require('mongoose')
    const admin = require('./routes/admin')
    const usuarios = require('./routes/usuario')
    const path = require('path')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')
    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')
    const bcrypt = require('bcryptjs')
    const passport = require('passport')
    require ('./config/auth')(passport)
    

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
        },}))
        app.set('view engine', 'handlebars')
    //mongoose
        mongoose.promise = global.promise
        mongoose.connect('mongodb://localhost/blogapp').then(()=>{
            console.log('banco conectado')
        }).catch((erro)=>{
            console.log('erro: '+erro)
        })
    //

    //public
    app.use(express.static(path.join(__dirname+"public")))

//rotas
app.get('/', (req, res)=>{
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render("index", {postagens: postagens})    
    }).catch((erro)=>{
        console.log(erro)
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/404")
    })
})

app.get('/404', (req, res)=>{
    res.send("erro 404!")
})

app.get('/postagem/:slug', (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "essa postagem não existe")
            res.redirect('/')
        }
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro interno")
        res.redirect('/')
    })
})

app.get('/categorias', (req, res)=>{
    Categoria.find().then((categorias)=>{
        res.render("categorias/index", {categorias: categorias})
    }).catch((erro)=>{
        req.flash("error_msg", "categorias não encontradas")
        req.redirect("/")
    })
})

app.get('/categoria/:slug', (req, res)=>{
    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
                console.log(postagens)
                console.log(categoria)
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


app.use('/admin', admin)
app.use('/usuarios', usuarios)

//outros
    const porta =  process.env.PORT || 8081
    app.listen(porta, ()=>{
        console.log('servidor rodando na url: localhost:'+porta)
    })