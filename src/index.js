const http = require('http');
const rotas = require('./rotas');

const porta = 3000;

rotas.listen(porta, () => {
    console.log(`Servidor escutando na porta ${porta}`);
});