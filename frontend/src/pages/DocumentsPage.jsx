import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentStore from '../store/documentStore';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function DocumentsPage() {
  const {
    documents,
    loading,
    error,
    fetchDocuments,
    deleteDocument
  } = useDocumentStore();

  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments(filters);
  }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este documento?')) {
      await deleteDocument(id);
      toast.success('Documento deletado com sucesso');
    }
  };

  if (loading) return <LoadingSpinner message="Carregando documentos..." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">📄 Meus Documentos</h1>
        <p className="text-slate-600 text-lg">Gerenciar e visualizar seus documentos processados</p>
      </div>

      {error && <Alert type="error" message={error} />}

      {documents.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-500 text-lg">Nenhum documento encontrado</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary mt-4"
          >
            Fazer Upload →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="card-hover group">
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-slate-900 truncate">{doc.fileName}</p>
                  <p className="text-sm text-slate-600">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/documents/${doc.id}`)}
                    className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="btn bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentsPage;
