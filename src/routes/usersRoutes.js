const express = require('express');
const router = express.Router();
const usersDB = require('../db/users.json');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *         - id
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         user:
 *           type: string
 *           description: Alcunha utilizada pelo usuário
 *         pwd:
 *           type: string
 *           description: Senha do usuário, que passa por um processo de criptografia
 *         level:
 *           type: string
 *           description: Nivel hierarquico ocupado pelo usuário
 *         status:
 *           type: string
 *           description: Estado de atividade do usuário
 *         id:
 *           type: string
 *           description: Código de identificação do usuário, gerado automaticamente
 *       example:
 *         name: Andre Faria Ruaro
 *         email: andre.ruaro@unesc.net
 *         user: andre.ruaro
 *         pwd: 7a6cc1282c5f6ec0235acd2bfa780145aaskem5n
 *         level: admin
 *         status: on
 *         id: 7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: 
  *     API de Controle de Usuários
  *     **Por Nicolas De Villa Cardoso**
  */

 /**
 * @swagger
 * /data/users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A lista de usuários completa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

// Retornar todos os usuarios
// GET "/data/users"
router.get('/', (req, res) =>{
    console.log("getroute");
    res.json(usersDB);
})

/**
 * @swagger
 * /data/users/nome/{name}:
 *   get:
 *     summary: Retorna um usuário pelo seu nome
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome pessoal do usuário
 *     responses:
 *       200:
 *         description: Um usuário pelo seu nome pessoal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// Retornar um usuario especifico
// GET /data/users/nome/andre
router.get('/nome/:name', (req, res) => {
    const nome = req.params.name
    console.log("Nome recebido na requisição:", nome);
    const usuario = usersDB.find(user => user.name.toLowerCase() === nome.toLowerCase());
    if(!usuario) return res.status(404).json({
        "erro": "Usuario não encontrado"
    })
    res.json(usuario)
})

/**
 * @swagger
 * /data/users/id/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Um usuário pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// Retornar um usuario especifico
// GET /data/users/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
router.get('/id/:id', (req, res) => {
    const id = req.params.id
    console.log("Id recebido na requisição:", id);
    const usuario = usersDB.find(user => user.id === id);
    if(!usuario) return res.status(404).json({
        "erro": "Usuario não encontrado"
    })
    res.json(usuario)
})

/**
 * @swagger
 * /data/users:
 *   post:
 *     summary: Cria um novo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O usuario foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

// Inserir um novo usuario
// POST "/data/users" BODY {"id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd", "name": "Andre Faria Ruaro", "email": "andre.ruaro@unesc.net", "user": "andre.ruaro", "pwd": "7a6cc1282c5f6ec0235acd2bfa780145aaskem5n", "level": "admin", "status": "on"},
router.post('/', async (req, res) => {
    const usuario = req.body
    console.log(usuario);

    // Gerar um novo ID
    usuario.id = uuidv4();
    
    if(!usuario.name) return res.status(400).json({
        "erro": "Usuario precisa ter um 'nome'"
    })
    
    if(!usuario.email) return res.status(400).json({
        "erro": "Usuario precisa ter um 'email'"
    })
    
    if(!usuario.user) return res.status(400).json({
        "erro": "Usuario precisa ter um 'username'"
    })
    
    if(!usuario.pwd) return res.status(400).json({
        "erro": "Usuario precisa ter um 'password'"
    })
    
    if(!usuario.level) return res.status(400).json({
        "erro": "Usuario precisa ter um 'nivel'"
    })
    
    if(!usuario.status) return res.status(400).json({
        "erro": "Usuario precisa ter um 'status'"
    })

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(usuario.pwd, saltRounds);
    usuario.pwd = hashedPassword;

    const camposValidos = ['id', 'name', 'email', 'user', 'pwd', 'level', 'status'];
    for (const campo in usuario) {
        if (!camposValidos.includes(campo)) {
            return res.status(400).json({ "erro": `Campo '${campo}' não é válido` });
        }
    }

    usersDB.push(usuario);
    return res.json(usuario);

})

/**
 * @swagger
 * /data/users/id/{id}:
 *   put:
 *     summary: Atualiza um usuario pela Id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id do usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O usuario foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// Substituir um usuario
// PUT "/data/users/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd" BODY {"id": "7a6cc1282jhndrfnjdfd", "name": "Nicolas De Villa Cardoso", "email": "Nicolas.Cardoso@unesc.net", "user": "Nicolas.Cardoso", "pwd": "7a6cc1282c5fhdfshifdjihn", "level": "admin", "status": "off"},
router.put('/id/:id', async (req, res) => {
    const id = req.params.id
    console.log("Id recebido na requisição:", id);
    const indiceUsuario = usersDB.findIndex(user => user.id === id);
    const novoUsuario = req.body

    if(indiceUsuario <= -1) return res.status(404).json({
        "erro": "Usuario não encontrado"
    })
    
    novoUsuario.id = usersDB[indiceUsuario].id
    
    if(!novoUsuario.name) return res.status(400).json({
        "erro": "Usuario precisa ter um 'nome'"
    })
    
    if(!novoUsuario.email) return res.status(400).json({
        "erro": "Usuario precisa ter um 'email'"
    })
    
    if(!novoUsuario.user) return res.status(400).json({
        "erro": "Usuario precisa ter um 'username'"
    })
    
    if(!novoUsuario.pwd) return res.status(400).json({
        "erro": "Usuario precisa ter um 'password'"
    })
    
    if(!novoUsuario.level) return res.status(400).json({
        "erro": "Usuario precisa ter um 'nivel'"
    })
    
    if(!novoUsuario.status) return res.status(400).json({
        "erro": "Usuario precisa ter um 'status'"
    })

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(novoUsuario.pwd, saltRounds);
    novoUsuario.pwd = hashedPassword;

    const camposValidos = ['id','name', 'email', 'user', 'pwd', 'level', 'status'];
    for (const campo in novoUsuario) {
        if (!camposValidos.includes(campo)) {
            return res.status(400).json({ "erro": `Campo '${campo}' não é válido` });
        }
    }

    usersDB[indiceUsuario] = novoUsuario
    return res.json(novoUsuario)
})

/**
 * @swagger
 * /data/users/id/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: O usuário foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

// Deletar um usuario
// DELETE "/data/users/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
router.delete('/id/:id', (req, res) => {
    const id = req.params.id
    console.log("Id recebido na requisição:", id);
    const indiceUsuario = usersDB.findIndex(user => user.id === id);
    if(indiceUsuario <= -1) return res.status(404).json({
        "erro": "Usuario não encontrado"
    })
    var deletado = usersDB.splice(indiceUsuario, 1)
    res.json(deletado)
})

module.exports = router