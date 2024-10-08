const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const fs = require('fs');

var teachersDB = loadTeachers();

// Função carrega professores a partir do arquivo JSON
function loadTeachers() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/teachers.json', 'utf8'));
    } catch (err) {
      return [];
    }
}

// Função para salvar os professores no arquivo JSON
function saveTeachers() {
    try {
      fs.writeFileSync('./src/db/teachers.json', JSON.stringify(teachersDB, null, 2));
      return "Sucesso"
    } catch (err) {
      return "Erro ao salvar";
    }
}


/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - school_disciplines
 *         - contact
 *         - phone_number
 *         - status
 *         - id
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do professor
 *         school_disciplines:
 *           type: string
 *           description: Disciplinas escolares que o professor ensina
 *         contact:
 *           type: string
 *           description: E-mail de contato do professor
 *         phone_number:
 *           type: string
 *           description: Número de telefone de contato
 *         status:
 *           type: string
 *           description: Status de atividade do professor
 *         id:
 *           type: string
 *           description: Código de identificação do professor, gerado automaticamente
 *       example:
 *         name: Judite Heeler
 *         school_disciplines: Artes, Português
 *         contact: j.heeler@gmail
 *         phone_number: 48 9696 5858
 *         status: on
 *         id: 7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
 */

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: 
 *      API de Controle de Professores
 *      **Por Igor Naspolini**
 */

/**
 * @swagger
 * /data/teachers:
 *   get:
 *     summary: Retorna uma lista de todos os professores
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A lista completa de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */

// Retornar todos os professores
// GET "/data/teachers"
router.get('/', (req, res) => {
    console.log("getroute");
    res.json(teachersDB);
});


/**
 * @swagger
 * /data/teachers/name/{name}:
 *   get:
 *     summary: Retorna um professor pelo nome
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do professor
 *     responses:
 *       200:
 *         description: Um professor pelo nome
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

// Retornar um professor específico pelo nome
// GET /data/teachers/name/Judite%20Heeler
router.get('/name/:name', (req, res) => {
    const name = req.params.name;
    console.log("Nome recebido na requisição:", name);
    const teacher = teachersDB.find(teacher => teacher.name.toLowerCase() === name.toLowerCase());
    if (!teacher) return res.status(404).json({
        "erro": "Professor não encontrado"
    });
    res.json(teacher);
});

/**
 * @swagger
 * /data/teachers/id/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Um professor pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

// Retornar um professor específico pelo ID
// GET /data/teachers/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
router.get('/id/:id', (req, res) => {
    const id = req.params.id;
    console.log("Id recebido na requisição:", id);
    const teacher = teachersDB.find(teach => teach.id === id);
    if (!teacher) return res.status(404).json({
        "erro": "Professor não encontrado"
    });
    res.json(teacher);
});


/**
 * @swagger
 * /data/teachers:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: O professor foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 */

// Inserir um novo professor
// POST "/data/teachers" BODY {"name": "Judite Heeler", "school_disciplines": "Artes, Português", "contact": "j.heeler@gmail", "phone_number": "48 9696 5858", "status": "on"}
router.post('/', (req, res) => {
    const newTeacher = {
        id: uuidv4(),
        ...req.body
    }
    console.log(newTeacher);
    teachersDB = loadTeachers();
    teachersDB.push(newTeacher);
    let result = saveTeachers();
    console.log(result);
    return res.json(newTeacher);
});


/**
 * @swagger
 * /data/teachers/id/{id}:
 *   put:
 *     summary: Atualiza um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: O professor foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

// Atualizar um professor
// PUT "/data/teachers/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd" BODY {"name": "Judite Heeler", "school_disciplines": "Artes, Português", "contact": "j.heeler@gmail", "phone_number": "48 9696 5858", "status": "off"}
router.put('/:id', (req, res) => {
    const id = req.params.id
    const newTeacher = req.body
    teachersDB = loadTeachers();
    const currentTeacher = teachersDB.find((teacher) => teacher.id === id)
    const currentIndex = teachersDB.findIndex((teacher) => teacher.id === id)
    if (!currentTeacher)
        return res.status(404).json({
            "Erro": "Professor não encontrado!"
        })
    teachersDB[currentIndex] = newTeacher
    let result = saveTeachers();
    console.log(result);
    return res.json(newTeacher);
});

/**
 * @swagger
 * /data/teachers/id/{id}:
 *   delete:
 *     summary: Remove um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: O professor foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

// Deletar um professor
// DELETE "/data/teachers/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
router.delete('/id/:id', (req, res) => {
    const id = req.params.id
    teachersDB = loadTeachers();
    const currentTeacher = teachersDB.find((teacher) => teacher.id === id)
    const currentIndex = teachersDB.findIndex((teacher) => teacher.id === id)
    if (!currentTeacher) return res.status(404).json({
        "Erro": "Professor não encontrado!"
    })
    var deletado = teachersDB.splice(currentIndex, 1)
    let result = saveTeachers();
    console.log(result);
    res.json(deletado);
});

module.exports = router;
