import express from 'express';

const router = express.Router();

router.use('/churches', require('./churches'));
router.use('/users', require('./users'));
router.use('/authentication', require('./authentication'));

router.use((req, res, next) => {
    const error = new Error('Not Found');
    res.status(404);
    next(error);
});

module.exports = router;
