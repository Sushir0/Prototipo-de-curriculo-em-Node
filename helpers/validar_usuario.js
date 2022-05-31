var validar_usuario = {
    nome: (nome)=>{
        if(!nome || typeof nome == undefined || nome == null){
            return true
        }else{
            return false
        }
    },
    email: (email)=>{
        if(!email || typeof email == undefined || email == null){
            return true
        }else{
            return false
        }
    },
    senha: (senha, senha2)=>{
        var array_quebrado_por_espaco = senha.split(" ")
        
        if(!senha || typeof senha == undefined || senha == null || array_quebrado_por_espaco.length > 1 ||
            senha.length < 4 || senha != senha2){
            return true
        }else{
            return false
        }
    },
    validar_edicao: (nome, email, senha, senha2)=>{
        var erros = []
        if(validar_usuario.nome(nome)){
            erros.push({texto: "nome inválido"})
        }

        if(validar_usuario.email(email)){
            erros.push({texto: "email inválido"})
        }

        if(validar_usuario.senha(senha, senha2)){
            erros.push({texto: "senha inválida inválido"})
        }

        if(erros.length>0){
            return erros
        }else{
            return null
        }

    }
}

module.exports = validar_usuario