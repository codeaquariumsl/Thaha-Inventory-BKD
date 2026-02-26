const express = require('express');
const router = express.Router();
const colorController = require('../controllers/color.controller');

router.post('/', colorController.createColor);
router.get('/', colorController.getAllColors);
router.get('/:id', colorController.getColorById);
router.put('/:id', colorController.updateColor);
router.delete('/:id', colorController.deleteColor);

module.exports = router;
