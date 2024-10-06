const express = require('express');
const router = express.Router();
const fs = require('fs');

// Carregar os dados de eventos
const eventsFilePath = '../trabalhoapirest-main/src/db/events.json';
const getEvents = () => JSON.parse(fs.readFileSync(eventsFilePath));
const saveEvents = (data) => fs.writeFileSync(eventsFilePath, JSON.stringify(data, null, 2));

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: O ID é gerado automaticamente quando o evento é criado.
 *         description:
 *           type: string
 *           description: Descrição do evento.
 *         comments:
 *           type: string
 *           description: Comentários adicionais sobre o evento.
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento.
 *       example:
 *         id: "1633072800000"
 *         description: "Evento de lançamento"
 *         comments: "Comentários sobre o evento"
 *         date: "2024-10-01 10:00:00"
 */

/**
 * @swagger
 * tags:
 *   - name: Eventos
 *     description: API de Controle de Eventos Por Igor Naspolini
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna uma lista de todos os eventos
 *     tags: [Eventos]
 *     responses:
 *       '200':
 *         description: A lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */ 

router.get('/', (req, res) => {
    const events = getEvents();
    res.json(events);
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       '200':
 *         description: Um evento pelo ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '404':
 *         description: Evento não encontrado
 */ 

router.get('/:id', (req, res) => {
    const events = getEvents();
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
        return res.status(404).send('Evento não encontrado');
    }
    res.json(event);
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Evento de lançamento"
 *               comments:
 *                 type: string
 *                 example: "Comentários adicionais sobre o evento"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-01T10:00:00Z"
 *     responses:
 *       '201':
 *         description: O evento foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */

router.post('/', (req, res) => {
    const events = getEvents();
    const newEvent = {
        id: Date.now().toString(),
        description: req.body.description,
        comments: req.body.comments,
        date: req.body.date
    };
    events.push(newEvent);
    saveEvents(events);
    res.status(201).json(newEvent);
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Evento atualizado"
 *               comments:
 *                 type: string
 *                 example: "Comentários atualizados"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-01T10:00:00Z"
 *     responses:
 *       '200':
 *         description: O evento foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '404':
 *         description: Evento não encontrado
 */

router.put('/:id', (req, res) => {
    const events = getEvents();
    const index = events.findIndex(e => e.id === req.params.id);
    if (index === -1) {
        return res.status(404).send('Evento não encontrado');
    }

    const updatedEvent = {
        ...events[index],
        description: req.body.description,
        comments: req.body.comments,
        date: req.body.date
    };

    events[index] = updatedEvent;
    saveEvents(events);
    res.json(updatedEvent);
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       '204':
 *         description: Evento removido com sucesso
 *       '404':
 *         description: Evento não encontrado
 */

router.delete('/:id', (req, res) => {
    let events = getEvents();
    events = events.filter(e => e.id !== req.params.id);
    saveEvents(events);
    res.status(204).send();
});

module.exports = router;
