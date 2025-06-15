const express = require("express")
const fs = require ("fs")
const path = require ("path")

const app = express()

const users = []
const hts = []
const { IpFilter, IpDeniedError} = require('express-ipfilter')

const Ippermitidos = ['::ffff:127.0.0.1','127.0.0.1',
    '::ffff:192.168.0.104','192.168.0.104'] // Todos os ips autorizados

const ipFilter = IpFilter(Ippermitidos,{mode:'allow'}) // deny bloquear


app.use(express.json())

// incluir novo usuário
/*app.post('/usuarios',(req,res) =>{
     
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
*/

// rota protegida (incluir ip: do ponto de envio)
app.post('/hts',ipFilter,(req,res) =>{
        // Filtragem por Cliente
        const allowIP ='192.168.0.104' // ip remoto de envio 
        const clientIP = req.ip
        if (clientIP == allowIP || clientIP == "::ffff:"+allowIP){
            hts.push(req.body)
            res.status(200).json(req.body)
      
            // Escreve no arquivo
            fs.writeFile(path.join(__dirname,"/data","hts.json"),
            JSON.stringify(hts,null,2), (error) => {
                if (error) {
                    return console.log("Erro:",error);
                }
            console.log("Arquivo hts salvo com sucesso !!! ")
            })
        
        }else{
            res.status(403).send("Acesso negado !!!")
        }

})

// lista de usuários com filtro tambem
app.get('/usuarios',ipFilter,(req,res) => {
        const allowIP ='192.168.0.104' // ip remoto de envio 
        const clientIP = req.ip
        if (clientIP == allowIP || clientIP == "::ffff:"+allowIP){ 
            // req.query retorna ...usuarios?name=eduardo&idade=52
            console.log("Pesquisa:",req.query)
       
            fs.readFile(path.join(__dirname,"/data","usuarios.json")
            ,"utf8",(error,data) => {
                if (error) {
                    return console.log("Erro:",error)
                }
                console.log(data)
                res.status(200).json(data)    
                console.log(req.ip)
        })
    }else{
        res.status(403).send("<h1>Acesso negado !!!</h1>")
    }

})

// Alterar/consultar o usuario pelo :id (variavel)
/*app.put('/usuarios/:id',(req,res) =>{
       
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
*/


// Tratamento de erros para Ips bloqueados
app.use((err,req, res, next) => {

    if (err instanceof IpDeniedError){
    res.status(403).send('Acesso negado: Área Registra !!!')
}else{
    next(err)
}

})

//servidor http 
//app.listen(3000,() => console.log("[*] Servidor Nodejs Ativado http !"))

//servidor https
const https = require('https')

pathkey = '/home/eduardo/keynodejs.pem'
pathcert = '/home/eduardo/certificate.pem'

const key = fs.readFileSync(pathkey)
const cert = fs.readFileSync(pathcert)

const credencial = {key:key,cert:cert}

const httpsServer = https.createServer(credencial,app)

httpsServer.listen(3000,() =>{
     console.log("[*] Servidor Nodejs Ativado https !")})



// checagem de ips de acesso ao nodejs


/*const checkIpsAcess = (req,res,next) => {
    const ALLOWIPS = "192.168.0.104"
    const CLIENTIP = req.ip

    if (CLIENTIP == ALLOWIPS || CLIENTIP == "::ffff:"+ALLOWIPS){
        next()
    }else{
        res.status(403).send("Acesso negado !!!")
    }



}
app.use(checkIpsAcess)
app.get('/',(req,res)=>{
    res.send("Seu ip é :",req.ip)
}) */

