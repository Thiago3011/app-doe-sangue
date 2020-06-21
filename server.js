// Configurando o servidor

const express = require("express");
const server = express();

// Configurar o servidor para apresentar arquivos estáticos (css, html)

server.use(express.static("public"));

// Habilitar body do form

server.use(express.urlencoded({ extended: true }));

// Configurar a conexão com o banco de dados

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 1234,
    host: 'localhost',
    port: 5432,
    database: 'doe'
});

// Configurando a template engine

const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true
});

// Configurar a apresentação da página

server.get("/", function (request, response) {
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return response.send("Erro no banco de dados.");
        
        const donors = result.rows;
        return response.render("index.html", { donors });

    })


});

server.post("/", function (request, response) {
    // Pegar dados do formulario

    const name = request.body.name;
    const email = request.body.email;
    const blood = request.body.blood;

    if (name == "" || email == "" || blood == "") {
        return response.send('Todos os campos são obrigatórios!');
    }

    // Coloca valores dentro do SGDB

    const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES($1, $2, $3)`

    const values = [name, email, blood];

    db.query(query, values, function (err) {
        if (err) return response.send("erro no banco de dados.");

        return response.redirect("/");
    });


});

// Ligar o servidor e permitir o acesso na porta 3000

server.listen(3000, console.log('iniciei o servidor!'));