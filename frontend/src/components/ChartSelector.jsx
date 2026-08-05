import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function ChartSelector({ onSelect, selectedChart = 'bar' }) {
  const [isOpen, setIsOpen] = useState(false);

  const charts = [
    { value: 'bar', label: '📊 Gráfico de Barras' },
    { value: 'line', label: '📈 Gráfico de Linhas' },
    { value: 'pie', label: '🥧 Gráfico de Pizza' },
    { value: 'doughnut', label: '🍩 Gráfico de Rosca' },
    { value: 'area', label: '📉 Gráfico de Área' },
    { value: 'scatter', label: '✨ Gráfico de Dispersão' },
    { value: 'bubble', label: '🫧 Gráfico de Bolhas' },
    { value: 'radar', label: '🎯 Gráfico de Radar' },
    { value: 'box', label: '📦 Gráfico de Caixa' },
    { value: 'histogram', label: '📊 Histograma' },
    { value: 'funnel', label: '🔻 Gráfico de Funil' },
    { value: 'heatmap', label: '🔥 Mapa de Calor' }
  ];

  const selected = charts.find(c => c.value === selectedChart);

  return (
    <div className="relative inline-block w-full md:w-72">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg flex items-center justify-between hover:bg-slate-50 text-left"
      >
        <span className="font-medium text-slate-900">{selected?.label || 'Selecionar gráfico'}</span>
        <ChevronDownIcon className="w-5 h-5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {charts.map(chart => (
            <button
              key={chart.value}
              onClick={() => {
                onSelect(chart.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-slate-100 transition-colors ${
                selectedChart === chart.value ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              {chart.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChartSelector;
