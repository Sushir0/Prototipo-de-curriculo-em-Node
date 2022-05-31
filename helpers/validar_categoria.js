var validar_categoria = {
    nome: (nome)=>{
        if(!nome || typeof nome == undefined || nome == null){
            return true
        }else{
            return false
        }
    },
    slug: function(slug){
        var array_quebrado_por_espaco = slug.split(" ")
        if(!slug || typeof slug == undefined || slug == null || array_quebrado_por_espaco.length > 1){
            return true
        }else{
            return false
        }
    },
    validar_edicao: (nome, slug)=>{
        var erros = []
        if(validar_categoria.nome(nome)){
            erros.push({texto: "nome inválido"})
        }

        if(validar_categoria.slug(slug)){
            erros.push({texto: "slug inválido"})
        }

        if(erros.length>0){
            return erros
        }else{
            return null
        }

    }


}

module.exports = validar_categoria