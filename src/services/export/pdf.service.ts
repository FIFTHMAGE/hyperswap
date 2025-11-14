/**
 * PDF generation service
 * @module services/export/pdf
 */

import html2canvas from 'html2canvas';

/**
 * Export element to PDF
 */
export async function exportElementToPDF(
  element: HTMLElement,
  filename: string = 'export.pdf'
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export PDF');
  }
}

/**
 * Export wrapped story to PDF
 */
export async function exportWrappedToPDF(
  containerId: string = 'wrapped-container'
): Promise<void> {
  const element = document.getElementById(containerId);
  
  if (!element) {
    throw new Error('Wrapped container not found');
  }

  await exportElementToPDF(element, 'year-wrapped.pdf');
}

/**
 * Export portfolio to PDF
 */
export async function exportPortfolioToPDF(
  containerId: string = 'portfolio-container'
): Promise<void> {
  const element = document.getElementById(containerId);
  
  if (!element) {
    throw new Error('Portfolio container not found');
  }

  await exportElementToPDF(element, 'portfolio.pdf');
}

/**
 * Generate PDF from data (simple table format)
 */
export function generateDataPDF(
  data: any[],
  headers: string[],
  filename: string = 'data.pdf'
): void {
  // Create temporary table element
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  // Add headers
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    th.style.border = '1px solid black';
    th.style.padding = '8px';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Add data rows
  const tbody = document.createElement('tbody');
  data.forEach(row => {
    const tr = document.createElement('tr');
    Object.values(row).forEach((value: any) => {
      const td = document.createElement('td');
      td.textContent = String(value);
      td.style.border = '1px solid black';
      td.style.padding = '8px';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // Add to DOM temporarily
  document.body.appendChild(table);

  // Export
  exportElementToPDF(table, filename).finally(() => {
    document.body.removeChild(table);
  });
}

