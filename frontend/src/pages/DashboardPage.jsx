import { useEffect, useState } from 'react';
import { getDashboardStats, getDashboardData } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import {
  BarChartComponent,
  LineChartComponent,
  PieChartComponent,
  AreaChartComponent
} from '../components/Charts';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, dataRes] = await Promise.all([
          getDashboardStats(),
          getDashboardData()
        ]);
        setStats(statsRes.data.stats);
        setDashboardData(dataRes.data.data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Carregando dashboard..." />;

  if (error) return <Alert type="error" message={error} />;

  const distributionData = stats?.byType
    ? Object.entries(stats.byType).map(([type, count]) => ({
        name: type,
        value: count
      }))
    : [];

  const sizeData = dashboardData?.documents
    ? dashboardData.documents.map(doc => ({
        name: doc.fileName.substring(0, 15),
        value: (doc.fileSize / 1024 / 1024).toFixed(2)
      }))
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">📊 Dashboard de Análises</h1>
        <p className="text-slate-600 text-lg">Visualize os dados extraídos de seus documentos</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-hover">
          <p className="text-slate-600 text-sm font-medium mb-1">Total de Documentos</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalDocuments || 0}</p>
        </div>
        <div className="card-hover">
          <p className="text-slate-600 text-sm font-medium mb-1">Tamanho Total</p>
          <p className="text-3xl font-bold text-green-600">
            {((stats?.totalSize || 0) / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <div className="card-hover">
          <p className="text-slate-600 text-sm font-medium mb-1">Tipos de Arquivo</p>
          <p className="text-3xl font-bold text-purple-600">
            {Object.keys(stats?.byType || {}).length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {distributionData.length > 0 && (
          <PieChartComponent
            data={distributionData}
            title="📊 Distribuição por Tipo"
          />
        )}
        {sizeData.length > 0 && (
          <BarChartComponent
            data={sizeData}
            title="💾 Tamanho dos Documentos"
          />
        )}
      </div>

      {/* Recent Uploads */}
      {stats?.recentUploads && stats.recentUploads.length > 0 && (
        <div className="card">
          <h2 className="subsection-title">🕐 Uploads Recentes</h2>
          <div className="space-y-2">
            {stats.recentUploads.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <p className="font-medium text-slate-900">{doc.fileName}</p>
                  <p className="text-sm text-slate-600">
                    {formatDistanceToNow(new Date(doc.createdAt), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-600 bg-slate-200 px-3 py-1 rounded">
                  {doc.mimeType.split('/').pop()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
