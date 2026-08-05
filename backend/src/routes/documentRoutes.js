const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/documentController');
const { validateDocumentUpdate } = require('../middleware/validation');

// Listar todos os documentos
router.get('/', DocumentController.getAll);

// Obter documento por ID
router.get('/:id', DocumentController.getById);

// Atualizar documento
router.put('/:id', validateDocumentUpdate, DocumentController.update);

// Deletar documento
router.delete('/:id', DocumentController.delete);

module.exports = router;
