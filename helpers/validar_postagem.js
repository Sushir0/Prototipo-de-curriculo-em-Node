var validar_postagem = {
    generico: (text)=>{
        if(!text || typeof text == undefined || text == null){
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
    categoria: (categoria)=>{
        if(!categoria || typeof categoria == undefined || categoria == null || categoria == "0"){
            return true
        }else{
            return false
        }
    },
    validar_edicao: (titulo, slug, descricao, conteudo, categoria)=>{
        var erros = []
        if(validar_postagem.generico(titulo)){
            erros.push({texto: "titulo inválido"})
        }

        if(validar_postagem.slug(slug)){
            erros.push({texto: "slug inválido"})
        }

        if(validar_postagem.generico(descricao)){
            erros.push({texto: 'descrição inválida'})
        }

        if(validar_postagem.generico(conteudo)){
            erros.push({texto: "conteúdo inválido"})
        }

        if(validar_postagem.categoria(categoria)){
            erros.push({texto: "categoria inválida"})
        }

        if(erros.length>0){
            return erros
        }else{
            return null
        }

    }
}

module.exports = validar_postagem