/**
 * CSV export service tests
 */

import { csvExportService } from '@/services/export/csv-export.service';

describe('CSV Export Service', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();

    // Mock document.createElement and click
    const mockLink = { click: jest.fn(), href: '', download: '' };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
  });

  test('exports data to CSV', () => {
    const data = [
      { name: 'Alice', age: 30, city: 'NYC' },
      { name: 'Bob', age: 25, city: 'LA' },
    ];

    csvExportService.exportToCSV(data, 'test.csv');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  test('handles empty data', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    csvExportService.exportToCSV([], 'test.csv');

    expect(consoleSpy).toHaveBeenCalledWith('No data to export');
    consoleSpy.mockRestore();
  });
});
