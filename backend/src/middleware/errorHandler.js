const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  const errorResponse = {
    error: err.message || 'Erro interno do servidor',
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(errorResponse);
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
