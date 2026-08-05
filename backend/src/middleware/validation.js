const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateDocumentUpdate = [
  body('title').optional().isString().trim(),
  body('description').optional().isString().trim(),
  body('data').optional().isObject(),
  validateRequest
];

module.exports = {
  validateRequest,
  validateDocumentUpdate
};
