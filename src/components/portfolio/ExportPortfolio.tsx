/**
 * Export portfolio data component
 * @module components/portfolio/ExportPortfolio
 */

'use client';

import { styled } from 'nativewind';
import { Button } from '../ui';

const ExportPortfolio: React.FC = () => {
  const handleExportCSV = () => {
    // Export to CSV logic
    console.log('Exporting to CSV...');
  };

  const handleExportPDF = () => {
    // Export to PDF logic
    console.log('Exporting to PDF...');
  };

  const handleExportJSON = () => {
    // Export to JSON logic
    console.log('Exporting to JSON...');
  };

  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={handleExportCSV}>
        Export CSV
      </Button>
      <Button variant="outline" onClick={handleExportPDF}>
        Export PDF
      </Button>
      <Button variant="outline" onClick={handleExportJSON}>
        Export JSON
      </Button>
    </div>
  );
};

export default styled(ExportPortfolio);

