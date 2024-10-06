const express = require('express');
const router = express.Router();
const studentsDB = require('../db/students.json');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - parents
 *         - phone_number
 *         - special_needs
 *         - status
 *         - id
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do estudante
 *         age:
 *           type: string
 *           description: Idade do estudante
 *         parents:
 *           type: string
 *           description: Nomes dos pais do estudante
 *         phone_number:
 *           type: string
 *           description: Número de telefone de contato
 *         special_needs:
 *           type: string
 *           description: Necessidades especiais do estudante
 *         status:
 *           type: string
 *           description: Status de atividade do estudante
 *         id:
 *           type: string
 *           description: Código de identificação do estudante, gerado automaticamente
 *       example:
 *         name: Bingo Heeler
 *         age: "6"
 *         parents: Bandit Heeler e Chilli Heeler
 *         phone_number: 48 9696 5858
 *         special_needs: Síndrome de Down
 *         status: on
 *         id: 7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: 
 *    API de Controle de Estudantes
 *    **Por Nicolas Cardoso**
 */

/**
 * @swagger
 * /data/students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A lista completa de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */

// Retornar todos os estudantes
// GET "/data/students"
router.get('/', (req, res) =>{
    console.log("getroute");
    res.json(studentsDB);
})

/**
 * @swagger
 * /data/students/name/{name}:
 *   get:
 *     summary: Retorna um estudante pelo nome
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo nome
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// Retornar um estudante específico pelo nome
// GET /data/students/nome/bingo%20heeler
router.get('/name/:name', (req, res) => {
    const nome = req.params.name;
    console.log("Nome recebido na requisição:", nome);
    const estudante = studentsDB.find(stu => stu.name.toLowerCase() === nome.toLowerCase());
    if (!estudante) return res.status(404).json({ 
        "erro": "Estudante não encontrado" 
    });
    res.json(estudante);
});


/**
 * @swagger
 * /data/students/id/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// Retornar um estudante específico pelo ID
// GET /data/students/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
router.get('/id/:id', (req, res) => {
    const id = req.params.id;
    console.log("Id recebido na requisição:", id);
    const estudante = studentsDB.find(stu => stu.id === id);
    if (!estudante) return res.status(404).json({ 
        "erro": "Estudante não encontrado" 
    });
    res.json(estudante);
});

/**
 * @swagger
 * /data/students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: O estudante foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */

// Inserir um novo estudante
// POST "/data/students" BODY {"id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd", "name": "Bingo Heeler", "age": "6", "parents": "Bandit Heeler e Chilli Heeler", "phone_number": "48 9696 5858", "special_needs": "Síndrome de Down", "status": "on"},
router.post('/', async (req, res) => {
    const estudante = req.body;
    console.log(estudante);

    // Gerar um novo ID
    estudante.id = uuidv4();
    
    if (!estudante.name) return res.status(400).json({
        "erro": "Estudante precisa ter um 'nome'"
    });
    
    if (!estudante.age) return res.status(400).json({
        "erro": "Estudante precisa ter uma 'idade'"
    });
    
    if (!estudante.parents) return res.status(400).json({
        "erro": "Estudante precisa ter 'pais'"
    });
    
    if (!estudante.phone_number) return res.status(400).json({
        "erro": "Estudante precisa ter um 'número de telefone'"
    });
    
    if (!estudante.special_needs) return res.status(400).json({
        "erro": "Estudante precisa ter 'necessidades especiais'"
    });
    
    if (!estudante.status) return res.status(400).json({
        "erro": "Estudante precisa ter um 'status'"
    });

    const camposValidos = ['id', 'name', 'age', 'parents', 'phone_number', 'special_needs', 'status'];
    for (const campo in estudante) {
        if (!camposValidos.includes(campo)) {
            return res.status(400).json({ "erro": `Campo '${campo}' não é válido` });
        }
    }

    studentsDB.push(estudante);
    return res.json(estudante);

});

/**
 * @swagger
 * /data/students/id/{id}:
 *   put:
 *     summary: Atualiza um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: O estudante foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// Substituir um estudante
// PUT "/data/students/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd" BODY {"id": "7a6cc1282jhndrfnjdfd", "name": "Bingo Heeler", "age": "6", "parents": "Bandit Heeler e Chilli Heeler", "phone_number": "48 9696 5858", "special_needs": "Síndrome de Down", "status": "off"},
router.put('/id/:id', async (req, res) => {
    const id = req.params.id;
    console.log("Id recebido na requisição:", id);
    const indiceEstudante = studentsDB.findIndex(student => student.id === id);
    const novoEstudante = req.body;

    if (indiceEstudante <= -1) return res.status(404).json({
        "erro": "Estudante não encontrado"
    });

    novoEstudante.id = studentsDB[indiceEstudante].id;
    
    if (!novoEstudante.name) return res.status(400).json({
        "erro": "Estudante precisa ter um 'nome'"
    });

    if (!novoEstudante.age) return res.status(400).json({
        "erro": "Estudante precisa ter uma 'idade'"
    });

    if (!novoEstudante.parents) return res.status(400).json({
        "erro": "Estudante precisa ter 'pais'"
    });

    if (!novoEstudante.phone_number) return res.status(400).json({
        "erro": "Estudante precisa ter um 'número de telefone'"
    });

    if (!novoEstudante.special_needs) return res.status(400).json({
        "erro": "Estudante precisa ter 'necessidades especiais'"
    });

    if (!novoEstudante.status) return res.status(400).json({
        "erro": "Estudante precisa ter um 'status'"
    });
   
    const camposValidos = ['id', 'name', 'age', 'parents', 'phone_number', 'special_needs', 'status'];
    for (const campo in novoEstudante) {
        if (!camposValidos.includes(campo)) {
            return res.status(400).json({ "erro": `Campo '${campo}' não é válido` });
        }
    }


    studentsDB[indiceEstudante] = novoEstudante;
    return res.json(novoEstudante);
});

/**
 * @swagger
 * /data/students/id/{id}:
 *   delete:
 *     summary: Remove um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: O estudante foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// Deletar um estudante
// DELETE "/data/students/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
router.delete('/id/:id', (req, res) => {
    const id = req.params.id;
    console.log("Id recebido na requisição:", id);
    const indiceEstudante = studentsDB.findIndex(stu => stu.id === id);
    if (indiceEstudante <= -1) return res.status(404).json({ 
        "erro": "Estudante não encontrado" 
    });
    const estudanteDeletado = studentsDB.splice(indiceEstudante, 1);
    res.json(estudanteDeletado);
});

module.exports = router;