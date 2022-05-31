module.exports = {
    isAdmin: (req, res, next)=>{
        if(req.isAuthenticated() && req.user.eAdmin != 0){
            return next()
        }else{
            req.flash('error_msg', "você precisa ser um administrador")
            res.redirect('/')
            return false
        }
    }
}