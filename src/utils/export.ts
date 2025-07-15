import { CompanyData } from '../types/scraper';

export const exportToCSV = (companies: CompanyData[]): void => {
  const headers = [
    'Company Name',
    'Website URL',
    'Email',
    'Phone',
    'Address',
    'Description',
    'Industry',
    'Employee Count',
    'Founded',
    'LinkedIn',
    'Twitter',
    'Facebook',
    'Status',
    'Error',
    'Extracted At'
  ];

  const csvContent = [
    headers.join(','),
    ...companies.map(company => [
      escapeCSV(company.companyName || ''),
      escapeCSV(company.websiteUrl || ''),
      escapeCSV(company.email || ''),
      escapeCSV(company.phone || ''),
      escapeCSV(company.address || ''),
      escapeCSV(company.description || ''),
      escapeCSV(company.industry || ''),
      escapeCSV(company.employeeCount || ''),
      escapeCSV(company.founded || ''),
      escapeCSV(company.socialMedia?.linkedin || ''),
      escapeCSV(company.socialMedia?.twitter || ''),
      escapeCSV(company.socialMedia?.facebook || ''),
      escapeCSV(company.status),
      escapeCSV(company.error || ''),
      escapeCSV(company.extractedAt.toISOString())
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, 'company-data.csv', 'text/csv');
};

export const exportToJSON = (companies: CompanyData[]): void => {
  const jsonContent = JSON.stringify(companies, null, 2);
  downloadFile(jsonContent, 'company-data.json', 'application/json');
};

const escapeCSV = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};