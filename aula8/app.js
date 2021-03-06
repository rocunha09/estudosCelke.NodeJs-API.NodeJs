const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

require("./models/Artigo");
const Artigo = mongoose.model('artigo'); //armazena a model Artigo
const app = express();

app.use(express.json());
//criando um middleware para uso do cors
app.use((req, res, next)=>{
    //console.log("acesso o middleware...");
    //neste caso ele libera qualquer lugar fazer uma requisição
    res.header("Access-Control-Allow-Origin", "*"); 

    //neste caso ele libera somente localhost:8080 fazer uma requisição
    //res.header("Access-Control-Allow-origin", "http://localhost:8080"); 

    //neste caso ele indica quais verbos podem ser usados para os clients que consumirem a API
    res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
    
    app.use(cors());
    next();
});

mongoose.connect('mongodb://localhost/celke', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log("Conexao com MongoDB realizada com sucesso");
}).catch((erro) => {
    console.log("falha ao se conectar ao banco de dados: " + erro);
});

//listar artigos
app.get("/", function(req, res){
    Artigo.find({}).then((artigo)=>{ //find poderia receber condição, mas nesse caso recebe tudo o que retornar...
        return res.json(artigo);
    }).catch((erro) => {
        return res.status(400).json({
            error: true,
            message: "Error: nenhum Artigo encontrado! => " + erro
        });
    });
});

//visualizar 1 artigo
app.get("/artigo/:id", function(req, res){
    Artigo.findOne({_id:req.params.id}).then((artigo)=>{ //find recebe o id como parametro por isso findOne
        return res.json(artigo);
    }).catch((erro) => {
        return res.status(400).json({
            error: true,
            message: "Error: nenhum Artigo encontrado! => " + erro
        });
    });
});

//cadastrar artigo
app.post("/artigo", function(req, res){
    //return res.json(req.body);

    const artigo = Artigo.create(req.body, (erro)=> {
        if(erro){
            return res.status(400).json({
                error: true,
                message: "Error: Artigo não foi cadastrado com sucesso! => " + erro
            });  
        }

        return res.status(200).json({
            error: false,
            message: "cadastrado com sucesso!"
        });
    });
});

//editar artigo
app.put("/artigo/:id", function(req, res){
    const artigo = Artigo.updateOne({ _id: req.params.id}, req.body, (erro)=> {
        if(erro){
            return res.status(400).json({
                error: true,
                message: "Error: Artigo não foi editado com sucesso! => " + erro
            });  
        }

        return res.status(200).json({
            error: false,
            message: "artigo editado com sucesso!"
        });
    });
});

//deletar artigo
app.delete("/artigo/:id", function(req, res){
    const artigo = Artigo.deleteOne({ _id: req.params.id}, (erro)=> {
        if(erro){
            return res.status(400).json({
                error: true,
                message: "Error: Artigo não foi deletado com sucesso! => " + erro
            });  
        }

        return res.status(200).json({
            error: false,
            message: "artigo deletado com sucesso!"
        });
    });
});


app.listen(8080, () =>{
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
