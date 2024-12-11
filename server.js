const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { pool } = require('./database');

const app = express();
const port = 3000;

app.use(cors()); // Adiciona o CORS
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário no banco de dados
        const result = await pool.query('SELECT * FROM perfil WHERE email = $1', [email]);
        const user = result.rows[0];

        // Verifica se o usuário existe e se a senha está correta
        if (user && senha === user.senha) { // Verificação direta da senha
            // Cria um token JWT
            const token = jwt.sign({ email }, 's78H9156JilPws99', { expiresIn: '1h' });
            return res.json({ token });
        }

        // Se as credenciais estiverem incorretas
        return res.status(401).json({ message: 'Credenciais inválidas' });
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.post('/cadastro', async (req, res) => {
    const { email, senha, nome, cpf, celular } = req.body;

    try {
        // Verifica se o usuário já existe
        const result = await pool.query('SELECT email FROM perfil WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user) {
            // Se o usuário já existir, retorna um erro
            return res.status(409).json({ message: 'Usuário já existe' }); // 409 Conflict
        }

        // Insere o novo usuário no banco de dados
        await pool.query('INSERT INTO perfil (email, senha, nome, cpf, celular) VALUES ($1, $2, $3, $4, $5)', [email, senha, nome, cpf, celular]);

        // Retorna uma resposta de sucesso
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso' }); // 201 Created
    } catch (error) {
        console.error("Erro ao realizar cadastro:", error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Adicione isso ao seu código existente

app.get('/perfil', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtém o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, 's78H9156JilPws99');
        const email = decoded.email;

        // Busca os dados do usuário no banco de dados
        const result = await pool.query('SELECT * FROM perfil WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Retorna os dados do usuário, excluindo a senha
        const { senha, ...userData } = user; // Remove a senha do objeto de resposta
        return res.json(userData);
    } catch (error) {
        console.error("Erro ao obter dados do perfil:", error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.put('/alterar-senha', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtém o token do cabeçalho Authorization
    const { senhaAtual, novaSenha } = req.body; // Obtém a senha atual e a nova senha do corpo da requisição

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias.' });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, 's78H9156JilPws99');
        const email = decoded.email;

        // Busca o usuário no banco de dados
        const result = await pool.query('SELECT * FROM perfil WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se a senha atual está correta
        if (senhaAtual !== user.senha) {
            return res.status(401).json({ message: 'Senha atual incorreta.' });
        }

        // Atualiza a senha no banco de dados
        await pool.query('UPDATE perfil SET senha = $1 WHERE email = $2', [novaSenha, email]);

        return res.status(200).json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error("Erro ao alterar a senha:", error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.delete('/deletar-conta', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtém o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, 's78H9156JilPws99');
        const email = decoded.email;

        // Deleta o usuário no banco de dados
        const result = await pool.query('DELETE FROM perfil WHERE email = $1', [email]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        return res.status(200).json({ message: 'Conta deletada com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar conta:", error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Remover a função connectToDatabase e a chamada para ela
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Adicionar tratamento de erro para o pool
pool.on('error', (err) => {
    console.error('Erro no Pool de conexões:', err);
});