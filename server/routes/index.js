const express = require('express');

const router = express.Router();

router.use('/authentication', require('./authentication').default);
router.use('/churches', require('./churches').default);
router.use('/users', require('./users').default);
router.use('/tasks', require('./tasks').default);
router.use('/requests', require('./requests').default);
router.use('/user-roles', require('./user-roles').default);
router.use('/notifications', require('./notifications').default);
router.use('/schedules', require('./schedules').default);
router.use('/services', require('./services').default);
router.use('/roles', require('./roles').default);
router.use('/templates', require('./templates').default);
router.use('/events', require('./events').default);

export default router;
