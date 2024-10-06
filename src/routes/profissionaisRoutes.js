const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var profissionaisDB = loadProfissionais();

// Função carrega profissionais a partir do arquivo JSON
function loadProfissionais() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/profissionais.json', 'utf8'));
    } catch (err) {
      return [];
    }
}

// Função para salvar os profissionais no arquivo JSON
function saveProfissionais() {
    try {
      fs.writeFileSync('./src/db/profissionais.json', JSON.stringify(profissionaisDB, null, 2));
      return "Sucesso"
    } catch (err) {
      return "Erro ao salvar";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Profissional:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - client
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do profissional
 *         nome:
 *           type: string
 *           description: Nome do Profissional
 *         client:
 *           type: string
 *           description: Nome do cliente que marcou o agendamento 
 *         service:
 *           type: string
 *           description: Tipo de serviço oferecido
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento 
 *         status:
 *           type: string
 *           description: Status do agendamento 
 *         comments:
 *           type: string
 *           description: Comentários adicionais sobre o agendamento
 *       example:
 *         id: 4
 *         nome: Marika
 *         client: Radahn da Silva
 *         service: Consulta de Fisioterapia
 *         date: 2024-10-05 14:00:00
 *         status: on
 *         comments: Cliente pediu alteração para horário da tarde
 */

/**
 * @swagger
 * tags:
 *   name: Profissionais
 *   description:
 *     API de Controle de Profissionais 
 *     **Por Luigi Macarini**
 */

/**
 * @swagger
 * /profissionais:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais
 *     tags: [Profissionais]
 *     responses:
 *       200:
 *         description: A lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profissional'
 */

// GET "/profissionais"
router.get('/', (req, res) => {
    console.log("routeGet");
    profissionaisDB = loadProfissionais();
    res.json(profissionaisDB);
});

/**
 * @swagger
 * /profissionais/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissional'
 *       404:
 *         description: Profissional não encontrado
 */

// GET "    "
router.get('/:id', (req, res) => {
    const id = req.params.id
    profissionaisDB = loadProfissionais();
    var profissional = profissionaisDB.find((profissional) => profissional.id === id)
    if (!profissional) return res.status(404).json({
        "Erro": "Profissional não encontrado!"
    })
    res.json(profissional);
});

/**
 * @swagger
 * /profissionais:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Profissionais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profissional'
 *     responses:
 *       200:
 *         description: O profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissional'
 */

// POST "/profissionais" BODY No Postman {nome:"Nome"...}
router.post('/', (req, res) => {
    const newProfissional = {
        id: uuidv4(),
        ...req.body
    }
    console.log(newProfissional);
    profissionaisDB = loadProfissionais();
    profissionaisDB.push(newProfissional);
    let result = saveProfissionais();
    console.log(result);
    return res.json(newProfissional);
});

/**
 * @swagger
 * /profissionais/{id}:
 *   put:
 *     summary: Atualiza um profissional pelo ID
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profissional'
 *     responses:
 *       200:
 *         description: O profissional foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissional'
 *       404:
 *         description: Profissional não encontrado
 */

// PUT "/profissionais/1" BODY No Postman {nome:"Nome"...}
router.put('/:id', (req, res) => {
    const id = req.params.id
    const newProfissional = req.body
    profissionaisDB = loadProfissionais();
    const currentProfissional = profissionaisDB.find((profissional) => profissional.id === id)
    const currentIndex = profissionaisDB.findIndex((profissional) => profissional.id === id)
    if (!currentProfissional)
        return res.status(404).json({
            "Erro": "Profissional não encontrado!"
        })
    profissionaisDB[currentIndex] = newProfissional
    let result = saveProfissionais();
    console.log(result);
    return res.json(newProfissional);
});

/**
 * @swagger
 * /profissionais/{id}:
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: O profissional foi removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissional'
 *       404:
 *         description: Profissional não encontrado
 */

// DELETE "/profissionais/1"
router.delete('/:id', (req, res) => {
    const id = req.params.id
    profissionaisDB = loadProfissionais();
    const currentProfissional = profissionaisDB.find((profissional) => profissional.id === id)
    const currentIndex = profissionaisDB.findIndex((profissional) => profissional.id === id)
    if (!currentProfissional) return res.status(404).json({
        "Erro": "Profissional não encontrado!"
    })
    var deletado = profissionaisDB.splice(currentIndex, 1)
    let result = saveProfissionais();
    console.log(result);
    res.json(deletado);
})

module.exports = router;
