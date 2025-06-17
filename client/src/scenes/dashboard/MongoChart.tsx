import React, { useEffect, useRef } from 'react';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

interface MongoChartProps {
  chartId: string;
  height?: string;
  width?: string;
  filter?: Record<string, any>; 
}

const MongoChart: React.FC<MongoChartProps> = ({
  chartId,
  height = '100%',
  width = '100%',
  filter,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: 'https://charts.mongodb.com/charts-your-project-id',
    });

    const chart = sdk.createChart({
      chartId,
      theme: 'dark',
      background: 'transparent',
    });

    if (chartRef.current) {
      chart
        .render(chartRef.current)
        .catch((err) => console.error('Chart rendering failed', err));
    }

    if (filter) {
      chart
        .setFilter(filter)
        .catch((err) => console.error('Filter setting failed', err));
    }
  }, [chartId, filter]);

  return <div ref={chartRef} style={{ height, width }} />;
};

export default MongoChart;
