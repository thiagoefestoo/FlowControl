const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rota inicial de teste
app.get('/', (req, res) => {
  res.send('Hello from FlowControl backend!');
});

// Rota para listar todos os usuários
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
    res.status(200).json(results);
  });
});

// Rota para criar um novo usuário
app.post('/users', (req, res) => {
  const { username, email, password } = req.body;

  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  connection.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error('Erro ao criar usuário:', err);
      return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
    res.status(201).json({ message: 'Usuário criado com sucesso', id: result.insertId });
  });
});

// Rota para atualizar um usuário
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
  connection.query(query, [username, email, password, id], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar usuário:', err);
      return res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  });
});

// Rota para deletar um usuário
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar usuário:', err);
      return res.status(500).json({ message: 'Erro ao deletar usuário' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});