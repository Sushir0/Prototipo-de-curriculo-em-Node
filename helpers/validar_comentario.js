var validar_comentario = {
    generico: (text)=>{
        if(!text || typeof text == undefined || text == null){
            return true
        }else{
            return false
        }
    },
    
    validar_edicao: (titulo, conteudo)=>{
        var erros = []
        if(validar_comentario.generico(titulo)){
            erros.push({texto: "titulo inválido"})
        }

        if(validar_comentario.generico(conteudo)){
            erros.push({texto: "conteudo inválido"})
        }

        if(erros.length>0){
            return erros
        }else{
            return null
        }

    }
}

module.exports = validar_comentario