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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

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
