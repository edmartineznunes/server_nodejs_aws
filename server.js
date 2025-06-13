const express = require("express")
const fs = require ("fs")
const path = require ("path")

const app = express()

const users = []
const hts = []



app.use(express.json())

// incluir novo usuário
app.post('/usuarios',(req,res) =>{
      //console.log(req.body)
      //
      // res.send('ok post !!!') 

      users.push(req.body)
      res.status(201).json(req.body)
      //const jsonString = JSON.stringify(users,null,2)     

        // Escreve no arquivo
        fs.writeFile(path.join(__dirname,"/data","usuarios.json"),
        JSON.stringify(users,null,2), (error) => {
            if (error) {
                return console.log("Erro:",error);
         }
         console.log("Salvo com sucesso !!!")

})


})
// incluir coordenadas
app.post('/hts',(req,res) =>{
      //console.log(req.body)
      //
      // res.send('ok post !!!') 

      hts.push(req.body)
      res.status(200).json(req.body)
      //const jsonString = JSON.stringify(users,null,2)     

        // Escreve no arquivo
        fs.writeFile(path.join(__dirname,"/data","hts.json"),
        JSON.stringify(hts,null,2), (error) => {
            if (error) {
                return console.log("Erro:",error);
         }
         console.log("Salvo com sucesso !!! ")

})


})









// lista de usuários com filtro tambem
app.get('/usuarios',(req,res) => {
    //res.send('ok get !! ')  
        //res.status(200).json(users)
       // req.query retorna ...usuarios?name=eduardo&idade=52
       console.log("Pesquisa:",req.query)
       
       fs.readFile(path.join(__dirname,"/data","usuarios.json")
       ,"utf8",(error,data) => {
            if (error) {
                return console.log("Erro:",error)
            }
            console.log(data)
            res.status(200).json(data)    
         
        })
        

})

// Alterar/consultar o usuario pelo :id (variavel)
app.put('/usuarios/:id',(req,res) =>{
       
        const id = req.params.id
        const nome = req.body.nome
        const idade = req.body.idade
        const email = req.body.email
        
        console.log(req.params.id)
        console.log(id,nome,idade,email)
        res.status(202).json([{"id":id,"nome":nome,
            "idade":idade,"email":email}])

})

app.delete('/usuarios/:id',(req,res) => {

    const id = req.params.id
    res.status(200).json({mensagem:"Usuário Deletado com Sucesso !",id:id})


})



app.listen(3000,() => console.log("[*] Servidor Nodejs Ativado !"))
