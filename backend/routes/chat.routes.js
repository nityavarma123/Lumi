const router     = require('express').Router();
const controller = require('../controllers/chat.controller');
const { protect }= require('../middleware/auth');

router.use(protect);

router.post('/',            controller.sendMessage);
router.post('/contextual',  controller.sendContextualMessage);
router.get('/insight',      controller.getInsight);

module.exports = router;
