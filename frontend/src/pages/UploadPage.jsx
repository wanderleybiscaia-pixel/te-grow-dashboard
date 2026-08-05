import { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { uploadFile, uploadMultipleFiles } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { DocumentCheckIcon } from '@heroicons/react/24/outline';

function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const handleFilesSelected = async (files) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      
      if (files.length === 1) {
        response = await uploadFile(files[0]);
        const document = response.data.document;
        toast.success(`✅ ${document.fileName} processado com sucesso!`);
        setUploadedFiles([...uploadedFiles, document]);
      } else {
        response = await uploadMultipleFiles(files);
        toast.success(`✅ ${response.data.processed} arquivo(s) processado(s) com sucesso!`);
        if (response.data.errors?.length > 0) {
          toast.error(`⚠️ ${response.data.errors.length} arquivo(s) falharam`);
        }
        setUploadedFiles([...uploadedFiles, ...response.data.results]);
      }
    } catch (err) {
      const errorMessage = err.error || err.message || 'Erro ao fazer upload';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">📁 Upload de Documentos</h1>
        <p className="text-slate-600 text-lg">Envie seus documentos e deixe a IA analisar os dados</p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {isLoading && <LoadingSpinner message="Processando documento com IA..." />}

      {!isLoading && (
        <FileUpload
          onFilesSelected={handleFilesSelected}
          multiple={true}
          isLoading={isLoading}
        />
      )}

      {uploadedFiles.length > 0 && (
        <div className="card">
          <h2 className="subsection-title">✅ Documentos Processados</h2>
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => navigate(`/documents/${file.id}`)}
              >
                <div className="flex items-center gap-3">
                  <DocumentCheckIcon className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-slate-900">{file.fileName}</p>
                    <p className="text-sm text-slate-600">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button className="btn btn-primary">Ver Detalhes →</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
