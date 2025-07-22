const path = require('path');
const fs = require('fs');

module.exports = async (req, res) => {
  const referer = req.headers.referer || '';

  // Só permite acesso vindo do seu front-end
  if (!referer.startsWith('https://pitrowsky.github.io/supervisao-lbr')) {
    return res.status(403).send('Acesso negado');
  }

  const fileName = req.url.replace('/painel/', '') || 'index.html';
  const filePath = path.join(__dirname, '..', 'painel', fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Arquivo não encontrado');
  }

  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css'
  }[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.send(fs.readFileSync(filePath));
};
