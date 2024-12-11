const { Pool } = require("pg"); // Corrigido para usar Pool
const pool = new Pool({
    host: "localhost",      // Endereço do servidor
    port: 5433,             // Porta do PostgreSQL
    user: "postgres",       // Nome de usuário
    password: "15773662",   // Substitua por sua senha do PostgreSQL
    database: "servant"     // Nome do banco de dados
});

// Não é necessário uma função de conexão separada, o Pool gerencia isso
// Você pode adicionar um evento para verificar se o Pool está funcionando
pool.on('connect', () => {
    console.log("Conectado ao banco de dados com sucesso!");
});

pool.on('error', (err) => {
    console.error("Erro no Pool de conexões:", err);
});

// Exporte o pool
module.exports = { pool };