const express = require('express')
const router = express.Router()
const studentsRoutes = require('./studentsRoutes')
const appointmentsRoutes = require('./appointmentsRoutes')
const teachersRoutes = require('./teachersRoutes')
const usersRoutes = require('./usersRoutes')
const profissionaisRoutes = require('./profissionaisRoutes');
const eventosRoutes = require('./eventosRoutes');

router.use(express.json())
router.use('/data/students', studentsRoutes)
router.use('/data/appointments', appointmentsRoutes)
router.use('/data/teachers', teachersRoutes)
router.use('/data/users', usersRoutes)
router.use('/profissionais', profissionaisRoutes); 
router.use('/events', eventosRoutes);

module.exports = router