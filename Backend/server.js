const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Configura o CORS
app.use(cors());

// Criação da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Usuário padrão do MySQL no XAMPP
  password: '',      // Senha padrão do MySQL no XAMPP
  database: 'meu_banco', // Nome do seu banco de dados
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

// Defina uma rota para testar
app.get('/', (req, res) => {
  res.send('Servidor Node.js com MySQL!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});