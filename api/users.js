const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Evita múltiplas conexões
let conn = null;

// Define o Schema do usuário
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Função Serverless (executada a cada requisição)
module.exports = async (req, res) => {
  // Permitir apenas requisições do domínio https://pitrowsky.github.io
  const allowedOrigin = 'https://pitrowsky.github.io';

  // Adicionando cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Se for uma requisição OPTIONS (preflight), apenas retorna 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();  // Responde a preflight requests
  }

  // Responde se o método não for POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // Se não houver conexão, conecta ao MongoDB
  if (!conn) {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  const { username, password } = req.body;

  try {
    const found = await User.findOne({ username });
    if (!found) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
    }

    const valid = await bcrypt.compare(password, found.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Senha incorreta' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
};
