import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

function Alert({ type = 'info', message, onClose }) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={clsx('border rounded-lg p-4 flex items-center justify-between', styles[type])}>
      <p className="font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-current hover:opacity-70">
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default Alert;
