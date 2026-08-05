import { useEffect, useState } from 'react';
import { getChartData } from '../services/api';

export const useChartData = (documentId, chartType) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getChartData(documentId, chartType);
        setData(response.data.chartData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchData();
    }
  }, [documentId, chartType]);

  return { data, loading, error };
};
