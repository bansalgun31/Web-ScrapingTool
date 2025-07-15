export interface CompanyData {
  id: string;
  companyName: string;
  websiteUrl: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  industry?: string;
  employeeCount?: string;
  founded?: string;
  status: 'pending' | 'success' | 'error' | 'scraping';
  error?: string;
  extractedAt: Date;
}

export interface ScrapingConfig {
  maxRetries: number;
  timeout: number;
  rateLimit: number;
  extractSocialMedia: boolean;
  extractAddress: boolean;
  extractDescription: boolean;
}

export interface ScrapingStats {
  total: number;
  success: number;
  failed: number;
  pending: number;
}