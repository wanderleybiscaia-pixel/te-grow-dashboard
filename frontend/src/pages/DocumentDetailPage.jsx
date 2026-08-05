import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDocumentStore from '../store/documentStore';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import ChartSelector from '../components/ChartSelector';
import {
  BarChartComponent,
  LineChartComponent,
  PieChartComponent,
  AreaChartComponent,
  ScatterChartComponent,
  RadarChartComponent
} from '../components/Charts';
import { ArrowLeftIcon, PencilIcon, SaveIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentDocument, loading, error, fetchDocument, updateDocument } = useDocumentStore();
  const [selectedChart, setSelectedChart] = useState('bar');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchDocument(id);
  }, [id]);

  useEffect(() => {
    if (currentDocument) {
      setEditedData(currentDocument.extractedData || {});
    }
  }, [currentDocument]);

  if (loading) return <LoadingSpinner message="Carregando documento..." />;
  if (error) return <Alert type="error" message={error} />;
  if (!currentDocument) return <Alert type="warning" message="Documento não encontrado" />;

  const handleSaveChanges = async () => {
    try {
      await updateDocument(id, { extractedData: editedData });
      setIsEditing(false);
      toast.success('Documento atualizado com sucesso');
    } catch (err) {
      toast.error('Erro ao salvar mudanças');
    }
  };

  const handleInputChange = (key, value) => {
    setEditedData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Prepare data for charts
  const chartData = editedData ? Object.entries(editedData).map(([key, value]) => ({
    name: key,
    value: typeof value === 'number' ? value : (value?.length || 0)
  })) : [];

  const renderChart = () => {
    if (chartData.length === 0) return null;

    const chartProps = { data: chartData, title: `Dados do Documento - ${selectedChart}` };

    switch (selectedChart) {
      case 'bar':
        return <BarChartComponent {...chartProps} />;
      case 'line':
        return <LineChartComponent {...chartProps} />;
      case 'pie':
      case 'doughnut':
        return <PieChartComponent {...chartProps} />;
      case 'area':
        return <AreaChartComponent {...chartProps} />;
      case 'scatter':
        return <ScatterChartComponent {...chartProps} />;
      case 'radar':
        return <RadarChartComponent {...chartProps} />;
      default:
        return <BarChartComponent {...chartProps} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/documents')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-slate-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{currentDocument.fileName}</h1>
            <p className="text-slate-600">{currentDocument.mimeType}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-primary flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <XMarkIcon className="w-5 h-5" />
              Cancelar
            </>
          ) : (
            <>
              <PencilIcon className="w-5 h-5" />
              Editar
            </>
          )}
        </button>
      </div>

      {/* Chart Selector */}
      <div className="flex items-center justify-between">
        <h2 className="subsection-title">Visualização de Dados</h2>
        <ChartSelector onSelect={setSelectedChart} selectedChart={selectedChart} />
      </div>

      {/* Chart */}
      {renderChart()}

      {/* Data Editor */}
      {isEditing && (
        <div className="card bg-blue-50 border-2 border-blue-200">
          <h2 className="subsection-title text-blue-900">✏️ Editar Dados Extraídos</h2>
          <div className="space-y-4">
            {Object.entries(editedData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {key}
                </label>
                <input
                  type="text"
                  value={JSON.stringify(value)}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="input-field"
                />
              </div>
            ))}
            <button
              onClick={handleSaveChanges}
              className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
            >
              <SaveIcon className="w-5 h-5" />
              Salvar Mudanças
            </button>
          </div>
        </div>
      )}

      {/* Insights */}
      {currentDocument.insights && (
        <div className="card bg-green-50 border border-green-200">
          <h2 className="subsection-title text-green-900">💡 Insights da IA</h2>
          <p className="text-slate-700 whitespace-pre-wrap">
            {JSON.stringify(currentDocument.insights, null, 2)}
          </p>
        </div>
      )}

      {/* Chart Suggestions */}
      {currentDocument.chartSuggestions && (
        <div className="card bg-purple-50 border border-purple-200">
          <h2 className="subsection-title text-purple-900">📊 Sugestões de Gráficos</h2>
          <div className="space-y-3">
            {Array.isArray(currentDocument.chartSuggestions.chartSuggestions)
              ? currentDocument.chartSuggestions.chartSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="bg-white p-4 rounded border border-purple-200">
                    <p className="font-semibold text-slate-900">{suggestion.type}</p>
                    <p className="text-sm text-slate-600">{suggestion.reason}</p>
                  </div>
                ))
              : <p className="text-slate-600">{JSON.stringify(currentDocument.chartSuggestions)}</p>
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentDetailPage;
