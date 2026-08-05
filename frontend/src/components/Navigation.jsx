import { Link } from 'react-router-dom';
import {
  DocumentArrowUpIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function Navigation() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Te-Grow</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium"
          >
            <DocumentArrowUpIcon className="w-5 h-5" />
            Upload
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium"
          >
            <ChartBarIcon className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/documents"
            className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Documentos
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
