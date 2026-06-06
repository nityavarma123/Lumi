const router = require('express').Router();
const controller = require('../controllers/sleep.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', controller.getLogs);
router.get('/stats', controller.getStats);
router.post('/', controller.create);
router.delete('/:id', controller.remove);

module.exports = router;