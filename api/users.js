const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let conn = null;

// Schema e modelo
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://pitrowsky.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { username, password } = req.body;

  try {
    if (!conn) {
      conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Senha incorreta' });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
};
