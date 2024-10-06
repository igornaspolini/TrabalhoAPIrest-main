const express = require('express');
const router = express.Router();
const appointmentsDB = require('../db/appointments.json');
const { v4: uuidv4 } = require('uuid');

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
router.get('/professional/:professional', (req, res) => {
    const professional = req.params.professional;
    console.log("Nome recebido na requisição:", professional);
    const appointments = appointmentsDB.filter(app => app.professional.toLowerCase() === professional.toLowerCase()); //para achar tudo, filter ao invés de find
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
    const appointment = req.body;

    // Gerar um novo ID
    appointment.id = uuidv4();

    if (!appointment.specialty) return res.status(400).json({
        "erro": "Agendamento precisa ter uma 'especialidade'"
    });

    if (!appointment.comments) return res.status(400).json({
        "erro": "Agendamento precisa ter 'comentários'"
    });

    if (!appointment.date) return res.status(400).json({
        "erro": "Agendamento precisa ter uma 'data'"
    });

    if (!appointment.student) return res.status(400).json({
        "erro": "Agendamento precisa ter um 'aluno'"
    });

    if (!appointment.professional) return res.status(400).json({
        "erro": "Agendamento precisa ter um 'profissional'"
    });

    const camposValidos = ['id', 'specialty', 'comments', 'date', 'student', 'professional'];
    for (const campo in appointment) {
        if (!camposValidos.includes(campo)) {
            return res.status(400).json({ "erro": `Campo '${campo}' não é válido` });
        }
    }

    appointmentsDB.push(appointment);
    return res.json(appointment);
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
    const id = req.params.id;
    const indexAppointment = appointmentsDB.findIndex(app => app.id === id);
    const updatedAppointment = req.body;

    if (indexAppointment === -1) return res.status(404).json({
        "erro": "Agendamento não encontrado"
    });

    updatedAppointment.id = appointmentsDB[indexAppointment].id; // Manter o ID existente

    if (!updatedAppointment.specialty) return res.status(400).json({
        "erro": "Agendamento precisa ter uma 'especialidade'"
    });

    if (!updatedAppointment.comments) return res.status(400).json({
        "erro": "Agendamento precisa ter 'comentários'"
    });

    if (!updatedAppointment.date) return res.status(400).json({
        "erro": "Agendamento precisa ter uma 'data'"
    });

    if (!updatedAppointment.student) return res.status(400).json({
        "erro": "Agendamento precisa ter um 'aluno'"
    });

    if (!updatedAppointment.professional) return res.status(400).json({
        "erro": "Agendamento precisa ter um 'profissional'"
    });

    const camposValidos = ['id', 'specialty', 'comments', 'date', 'student', 'professional'];
    for (const campo in updatedAppointment) {
        if (!camposValidos.includes(campo)) {
            return res.status(400).json({ "erro": `Campo '${campo}' não é válido` });
        }
    }

    // Atualiza o agendamento
    appointmentsDB[indexAppointment] = updatedAppointment;

    return res.json(updatedAppointment);
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
    const id = req.params.id;
    const indexAppointment = appointmentsDB.findIndex(app => app.id === id);
    if (indexAppointment === -1) return res.status(404).json({
        "erro": "Agendamento não encontrado"
    });
    // Remove o agendamento da lista
    const deletado = appointmentsDB.splice(indexAppointment, 1);
    res.json(deletado);
});

module.exports = router;
