import { CompanyData, ScrapingConfig } from '../types/scraper';

// Mock data for demonstration
const mockCompanies = [
  {
    companyName: 'TechCorp Solutions',
    websiteUrl: 'https://techcorp.com',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, San Francisco, CA 94105',
    description: 'Leading provider of enterprise software solutions and cloud computing services.',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp'
    },
    industry: 'Software Development',
    employeeCount: '500-1000',
    founded: '2010'
  },
  {
    companyName: 'Innovation Labs',
    websiteUrl: 'https://innovationlabs.io',
    email: 'hello@innovationlabs.io',
    phone: '+1 (555) 987-6543',
    address: '456 Innovation Blvd, Austin, TX 78701',
    description: 'R&D company focused on emerging technologies and startup incubation.',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/innovationlabs',
      facebook: 'https://facebook.com/innovationlabs'
    },
    industry: 'Research & Development',
    employeeCount: '50-100',
    founded: '2018'
  },
  {
    companyName: 'Global Dynamics',
    websiteUrl: 'https://globaldynamics.com',
    email: 'info@globaldynamics.com',
    phone: '+1 (555) 456-7890',
    address: '789 Business Park, New York, NY 10001',
    description: 'Multinational corporation providing consulting and business solutions worldwide.',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/globaldynamics',
      twitter: 'https://twitter.com/globaldynamics',
      facebook: 'https://facebook.com/globaldynamics'
    },
    industry: 'Consulting',
    employeeCount: '10000+',
    founded: '1995'
  }
];

export class MockScraperService {
  private static generateMockData(url: string, config: ScrapingConfig): Partial<CompanyData> {
    const randomCompany = mockCompanies[Math.floor(Math.random() * mockCompanies.length)];
    const shouldFail = Math.random() < 0.2; // 20% failure rate for demonstration
    
    if (shouldFail) {
      throw new Error('Failed to extract data: Connection timeout or blocked by anti-bot measures');
    }

    // Simulate different extraction levels based on config
    const result: Partial<CompanyData> = {
      companyName: randomCompany.companyName,
      websiteUrl: url,
      email: randomCompany.email,
      phone: randomCompany.phone,
      industry: randomCompany.industry,
      employeeCount: randomCompany.employeeCount,
      founded: randomCompany.founded
    };

    if (config.extractSocialMedia) {
      result.socialMedia = randomCompany.socialMedia;
    }

    if (config.extractAddress) {
      result.address = randomCompany.address;
    }

    if (config.extractDescription) {
      result.description = randomCompany.description;
    }

    return result;
  }

  static async scrapeUrl(
    url: string, 
    config: ScrapingConfig
  ): Promise<CompanyData> {
    // Simulate network delay
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    await new Promise(resolve => setTimeout(resolve, delay));

    const id = `company-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const extractedData = this.generateMockData(url, config);
      
      return {
        id,
        status: 'success',
        extractedAt: new Date(),
        ...extractedData
      } as CompanyData;
    } catch (error) {
      return {
        id,
        companyName: '',
        websiteUrl: url,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        extractedAt: new Date()
      };
    }
  }

  static async searchCompanies(query: string): Promise<string[]> {
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock search results based on query
    const searchResults = [
      'https://example-company1.com',
      'https://example-company2.com',
      'https://example-company3.com',
      'https://startup-demo.com',
      'https://tech-solutions.com'
    ].map(url => `${url}?q=${encodeURIComponent(query)}`);

    return searchResults.slice(0, Math.floor(Math.random() * 3) + 3); // 3-5 results
  }
}