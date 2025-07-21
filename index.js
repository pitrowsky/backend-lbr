const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Permitir apenas o domínio do seu site acessar a API
app.use(cors({
  origin: 'https://pitrowsky.github.io/supervisao-lbr/'
}));

// Permitir leitura de JSON no corpo das requisições
app.use(express.json());

// Conexão com o MongoDB (o link real vai no .env como MONGO_URI)
mongoose.connect(process.env.MONGO_LOGIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Inicializar servidor (opcional se for usar no Vercel)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
