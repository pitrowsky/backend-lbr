const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

app.use(cors({
  origin: 'https://pitrowsky.github.io',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

app.options('*', cors());

// Middleware para JSON
app.use(express.json());

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('🟢 MongoDB conectado'))
  .catch((err) => console.error('🔴 Erro na conexão MongoDB:', err));

// Esquema de usuário
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Rota de login
app.post('/users', async (req, res) => {
  const { user, password } = req.body;

  try {
    const found = await User.findOne({ username: user });
    if (!found) return res.status(401).json({ success: false, message: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, found.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Senha incorreta' });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

// Protege o acesso aos arquivos da pasta painel
app.get('/painel/:file', async (req, res) => {
  const referer = req.get('referer');
  if (!referer || !referer.startsWith('https://pitrowsky.github.io/supervisao-lbr/')) {
    return res.status(403).send('Acesso negado');
  }

  const fileName = req.params.file;
  const filePath = path.join(__dirname, 'painel', fileName);
  res.sendFile(filePath);
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
