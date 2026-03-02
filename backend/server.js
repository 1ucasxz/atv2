const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite ler JSON enviado nas requisições POST

// Configuração da conexão com o banco de dados MySQL
// IMPORTANTE: Altere o 'user' e 'password' de acordo com a sua configuração local (ex: XAMPP)
const db = mysql.createConnection({
    host: 'benserverplex.ddns.net',
    user: 'alunos', // ajuste para o seu usuário (default do XAMPP é root)
    password: 'senhaAlunos', // ajuste para a sua senha (default do XAMPP é sem senha)
    database: 'web_03ma'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');

    // Cria a tabela se não existir (garante o funcionamento fácil)
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS lucas_produtos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      descricao TEXT,
      categoria VARCHAR(100)
    )
  `;
    db.query(createTableQuery, (err, result) => {
        if (err) console.error('Erro ao criar tabela:', err);
        else console.log('Tabela lucas_produtos verificada/pronta.');
    });
});

// GET /itens → retorna todos os registros
app.get('/itens', (req, res) => {
    const query = 'SELECT * FROM lucas_produtos';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar itens:', err);
            return res.status(500).json({ error: 'Erro ao buscar itens no banco de dados' });
        }
        res.json(results); // Retorna os resultados em formato JSON para o frontend
    });
});

// POST /itens → cadastra um novo item
app.post('/itens', (req, res) => {
    const { nome, descricao, categoria } = req.body;

    // Validação simples
    if (!nome) {
        return res.status(400).json({ error: 'O campo nome é obrigatório' });
    }

    const query = 'INSERT INTO lucas_produtos (nome, descricao, categoria) VALUES (?, ?, ?)';

    // Utiliza prepared statements (?) para evitar SQL Injection
    db.query(query, [nome, descricao, categoria], (err, result) => {
        if (err) {
            console.error('Erro ao inserir item:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar item no banco de dados' });
        }
        res.status(201).json({
            message: 'Item cadastrado com sucesso!',
            id: result.insertId
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor Backend rodando em http://localhost:${port}`);
});
