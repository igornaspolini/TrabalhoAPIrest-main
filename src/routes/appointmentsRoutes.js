const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var appointmentsDB = loadAppointments();

// Função carrega appointments a partir do arquivo JSON
function loadAppointments() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/appointments.json', 'utf8'));
    } catch (err) {
      return [];
    }
}

// Função para salvar os appointments no arquivo JSON
function saveAppointments() {
    try {
      fs.writeFileSync('./src/db/appointments.json', JSON.stringify(appointmentsDB, null, 2));
      return "Sucesso"
    } catch (err) {
      return "Erro ao salvar";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *         - id
 *       properties:
 *         specialty:
 *           type: string
 *           description: Especialidade do profissional
 *         comments:
 *           type: string
 *           description: Comentários sobre a consulta
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         student:
 *           type: string
 *           description: Nome do aluno
 *         professional:
 *           type: string
 *           description: Nome do profissional
 *         id:
 *           type: string
 *           description: Código de identificação do agendamento, gerado automaticamente
 *       example:
 *         specialty: Fisioterapeuta
 *         comments: Realizar sessão
 *         date: 2023-08-15 16:00:00
 *         student: Bingo Heeler
 *         professional: Winton Blake
 *         id: 7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: 
 *      API de Controle de Agendamentos
 *      **Por Luigi Macarini**
 */

/**
 * @swagger
 * /data/appointments:
 *   get:
 *     summary: Retorna uma lista de todos os agendamentos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: A lista completa de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */

// Retornar todos os agendamentos
// GET "/data/appointments"
router.get('/', (req, res) => {
    console.log("getroute");
    res.json(appointmentsDB);
});

/**
 * @swagger
 * /data/appointments/professional/{professional}:
 *   get:
 *     summary: Retorna agendamentos pelo nome do profissional
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: professional
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do profissional
 *     responses:
 *       200:
 *         description: Lista de agendamentos para o profissional
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Nenhum agendamento encontrado para o profissional
 */

// Retornar agendamentos pelo nome do profissional
// GET /data/appointments/professional/Winton%20Blake
router.get('/appointment/:appointment', (req, res) => {
    const appointment = req.params.appointment;
    console.log("Nome recebido na requisição:", appointment);
    const appointments = appointmentsDB.filter(app => app.appointment.toLowerCase() === appointment.toLowerCase()); //para achar tudo, filter ao invés de find
    if (!appointments) return res.status(404).json({
        "erro": "Nenhum agendamento encontrado para o profissional"
    });
    res.json(appointments);
});

/**
 * @swagger
 * /data/appointments/id/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Um agendamento pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 */

// Retornar um agendamento específico pelo ID
// GET /data/appointments/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
router.get('/id/:id', (req, res) => {
    const id = req.params.id;
    console.log("Id recebido na requisição:", id);
    const appointment = appointmentsDB.find(app => app.id === id);
    if (!appointment) return res.status(404).json({
        "erro": "Agendamento não encontrado"
    });
    res.json(appointment);
});

/**
 * @swagger
 * /data/appointments/date/{date}:
 *   get:
 *     summary: Retorna agendamentos pela data
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Data do agendamento no formato YYYY-MM-DD HH:mm:ss
 *     responses:
 *       200:
 *         description: Lista de agendamentos na data especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Nenhum agendamento encontrado na data especificada
 */

// Retornar agendamentos pela data
// GET /data/appointments/date/2023-08-15%2016:00:00
router.get('/date/:date', (req, res) => {
    const date = req.params.date;
    const appointments = appointmentsDB.filter(app => app.date === date);
    if (!appointments) return res.status(404).json({
        "erro": "Nenhum agendamento encontrado na data especificada"
    });
    res.json(appointments);
});

/**
 * @swagger
 * /data/appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: O agendamento foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 */

// Inserir um novo agendamento
// POST "/data/appointments" BODY {"specialty": "Fisioterapeuta", "comments": "Realizar sessão", "date": "2023-08-15 16:00:00", "student": "Bingo Heeler", "professional": "Winton Blake"}
router.post('/', (req, res) => {
    const newAppointment = {
        id: uuidv4(),
        ...req.body
    }
    console.log(newAppointment);
    appointmentsDB = loadAppointments();
    appointmentsDB.push(newAppointment);
    let result = saveAppointments();
    console.log(result);
    return res.json(newAppointment);
});

/**
 * @swagger
 * /data/appointments/id/{id}:
 *   put:
 *     summary: Atualiza um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: O agendamento foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 */

// Substituir um agendamento
// PUT "/data/appointments/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd" BODY {"specialty": "Fisioterapeuta", "comments": "Realizar sessão", "date": "2023-08-15 16:00:00", "student": "Bingo Heeler", "professional": "Winton Blake"}
router.put('/id/:id', (req, res) => {
    const id = req.params.id
    const newAppointment = req.body
    appointmentsDB = loadAppointments();
    const currentAppointment = appointmentsDB.find((appointment) => appointment.id === id)
    const currentIndex = appointmentsDB.findIndex((appointment) => appointment.id === id)
    if (!currentAppointment)
        return res.status(404).json({
            "Erro": "Agendamento não encontrado!"
        })
    appointmentsDB[currentIndex] = newAppointment
    let result = saveAppointments();
    console.log(result);
    return res.json(newAppointment);
});

/**
 * @swagger
 * /data/appointments/id/{id}:
 *   delete:
 *     summary: Deleta um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento deletado com sucesso
 *       404:
 *         description: Agendamento não encontrado
 */

// Deletar um agendamento pelo ID
// DELETE "/data/appointments/id/7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
router.delete('/id/:id', (req, res) => {
    const id = req.params.id
    appointmentsDB = loadAppointments();
    const currentAppointment = appointmentsDB.find((appointment) => appointment.id === id)
    const currentIndex = appointmentsDB.findIndex((appointment) => appointment.id === id)
    if (!currentAppointment) return res.status(404).json({
        "Erro": "Apointment não encontrado!"
    })
    var deletado = appointmentsDB.splice(currentIndex, 1)
    let result = saveAppointments();
    console.log(result);
    res.json(deletado);
})

module.exports = router;
