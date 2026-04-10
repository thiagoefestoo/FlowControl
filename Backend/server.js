const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;  // Usar variável de ambiente ou 5000

// Middleware para permitir CORS e processar JSON
app.use(cors());
app.use(express.json());

// Configuração de conexão com o banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'flow_control_db',
});

// Verificar a conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

// Ajustando a Content Security Policy
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; " + 
    "connect-src 'self' http://localhost:5000 ws://localhost:5000; " + // Permite requisições para o servidor e WebSockets
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + // Permite execução de scripts inline e unsafe-eval
    "style-src 'self' 'unsafe-inline'; " + // Permite estilos inline
    "img-src 'self' data:;"); // Permite imagens do próprio servidor e imagens base64
  next();
});

// Adicionando a Rota de Raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo ao servidor! A API está funcionando!');
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar se o usuário existe no banco de dados
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco de dados:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    // Caso o usuário não exista
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const user = results[0];

    // Comparando a senha fornecida com a senha criptografada no banco
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Erro na comparação da senha' });
      }

      // Caso a senha não seja compatível
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Se as credenciais estiverem corretas, retornar os dados do usuário
      res.status(200).json({
        message: 'Login bem-sucedido',
        user: { id: user.id, username: user.username, email: user.email },
      });
    });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});