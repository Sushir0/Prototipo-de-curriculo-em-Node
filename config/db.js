if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://sushiroRoberto:terrordosgames8@bancodedadosdomeublogte.lu3fb.mongodb.net/test"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}