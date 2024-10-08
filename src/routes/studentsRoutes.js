const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const fs = require('fs');

var studentsDB = loadStudents();

// Função carrega estudantes a partir do arquivo JSON
function loadStudents() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/students.json', 'utf8'));
    } catch (err) {
      return [];
    }
}

// Função para salvar os estudantes no arquivo JSON
function saveStudents() {
    try {
      fs.writeFileSync('./src/db/students.json', JSON.stringify(studentsDB, null, 2));
      return "Sucesso"
    } catch (err) {
      return "Erro ao salvar";
    }
}

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
router.post('/', (req, res) => {
    const newStudent = {
        id: uuidv4(),
        ...req.body
    }
    console.log(newStudent);
    studentsDB = loadStudents();
    studentsDB.push(newStudent);
    let result = saveStudents();
    console.log(result);
    return res.json(newStudent);
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
router.put('/:id', (req, res) => {
    const id = req.params.id
    const newStudent = req.body
    studentsDB = loadStudents();
    const currentStudent = studentsDB.find((student) => student.id === id)
    const currentIndex = studentsDB.findIndex((student) => student.id === id)
    if (!currentStudent)
        return res.status(404).json({
            "Erro": "Estudante não encontrado!"
        })
    studentsDB[currentIndex] = newStudent
    let result = saveStudents();
    console.log(result);
    return res.json(newStudent);
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
    const id = req.params.id
    studentsDB = loadStudents();
    const currentStudent = studentsDB.find((student) => student.id === id)
    const currentIndex = studentsDB.findIndex((student) => student.id === id)
    if (!currentStudent) return res.status(404).json({
        "Erro": "Student não encontrado!"
    })
    var deletado = studentsDB.splice(currentIndex, 1)
    let result = saveStudents();
    console.log(result);
    res.json(deletado);
});

module.exports = router;