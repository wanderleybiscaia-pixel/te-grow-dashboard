const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

// Estatísticas gerais
router.get('/stats', DashboardController.getStats);

// Dados completos do dashboard
router.get('/data', DashboardController.getDashboardData);

// Dados de gráficos específicos
router.get('/charts', DashboardController.getChartData);

module.exports = router;
