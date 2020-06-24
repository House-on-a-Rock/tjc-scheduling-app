import express from 'express';

const router = express.Router();

// router.use('/churches', require('./churches'));
// router.use('/users', require('./users'));
router.use('/authentication', require('./authentication'));
// router.use('/tasks', require('./tasks'));

module.exports = router;
