import React, { useState, useCallback } from 'react';
import { Search, Plus, Download, FileText, Database, Play, Square, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { CompanyData, ScrapingConfig, ScrapingStats } from './types/scraper';
import { CompanyCard } from './components/CompanyCard';
import { ProgressStats } from './components/ProgressStats';
import { ConfigPanel } from './components/ConfigPanel';
import { MockScraperService } from './services/mockScraper';
import { validateUrl, parseUrlList } from './utils/validation';
import { exportToCSV, exportToJSON } from './utils/export';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ScrapingConfig>({
    maxRetries: 2,
    timeout: 30,
    rateLimit: 1,
    extractSocialMedia: true,
    extractAddress: true,
    extractDescription: true
  });

  const stats: ScrapingStats = {
    total: companies.length,
    success: companies.filter(c => c.status === 'success').length,
    failed: companies.filter(c => c.status === 'error').length,
    pending: companies.filter(c => c.status === 'pending' || c.status === 'scraping').length
  };

  const addUrlsToQueue = useCallback((urls: string[]) => {
    const newCompanies: CompanyData[] = urls.map(url => ({
      id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      companyName: '',
      websiteUrl: url,
      status: 'pending',
      extractedAt: new Date()
    }));

    setCompanies(prev => [...prev, ...newCompanies]);
  }, []);

  const handleSearchCompanies = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsScrapingActive(true);
      const urls = await MockScraperService.searchCompanies(searchQuery);
      addUrlsToQueue(urls);
      setSearchQuery('');
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsScrapingActive(false);
    }
  }, [searchQuery, addUrlsToQueue]);

  const handleAddUrls = useCallback(() => {
    if (!urlInput.trim()) return;

    const urls = parseUrlList(urlInput);
    const validUrls: string[] = [];
    const errors: string[] = [];

    urls.forEach(url => {
      const validation = validateUrl(url);
      if (validation.isValid) {
        validUrls.push(url);
      } else {
        errors.push(`${url}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      alert(`Some URLs were invalid:\n${errors.join('\n')}`);
    }

    if (validUrls.length > 0) {
      addUrlsToQueue(validUrls);
      setUrlInput('');
    }
  }, [urlInput, addUrlsToQueue]);

  const scrapeCompany = useCallback(async (company: CompanyData) => {
    setCompanies(prev => 
      prev.map(c => 
        c.id === company.id 
          ? { ...c, status: 'scraping' }
          : c
      )
    );

    try {
      const result = await MockScraperService.scrapeUrl(company.websiteUrl, config);
      setCompanies(prev => 
        prev.map(c => 
          c.id === company.id 
            ? { ...result, id: company.id }
            : c
        )
      );
    } catch (error) {
      setCompanies(prev => 
        prev.map(c => 
          c.id === company.id 
            ? { 
                ...c, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Unknown error' 
              }
            : c
        )
      );
    }
  }, [config]);

  const handleStartScraping = useCallback(async () => {
    if (isScrapingActive) return;

    const pendingCompanies = companies.filter(c => c.status === 'pending');
    if (pendingCompanies.length === 0) return;

    setIsScrapingActive(true);

    for (const company of pendingCompanies) {
      if (!isScrapingActive) break;
      
      await scrapeCompany(company);
      
      // Rate limiting
      if (config.rateLimit > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 / config.rateLimit));
      }
    }

    setIsScrapingActive(false);
  }, [companies, isScrapingActive, config, scrapeCompany]);

  const handleStopScraping = useCallback(() => {
    setIsScrapingActive(false);
  }, []);

  const handleClearAll = useCallback(() => {
    setCompanies([]);
    setIsScrapingActive(false);
  }, []);

  const successfulCompanies = companies.filter(c => c.status === 'success');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Company Data Extractor
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract comprehensive company information including contact details, social media, and business data from websites and search queries.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Search Companies */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Search className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Search Companies</h3>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter search query (e.g., 'tech startups San Francisco')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchCompanies()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                onClick={handleSearchCompanies}
                disabled={!searchQuery.trim() || isScrapingActive}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Search Companies
              </button>
            </div>
          </div>

          {/* Add URLs */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Plus className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Add URLs</h3>
            </div>
            <div className="space-y-4">
              <div>
                <textarea
                  placeholder="Enter URLs (one per line, comma or semicolon separated)&#10;https://example.com&#10;https://another-company.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
              <button
                onClick={handleAddUrls}
                disabled={!urlInput.trim()}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add URLs to Queue
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="mb-8">
          <ConfigPanel
            config={config}
            onConfigChange={setConfig}
            isOpen={showConfig}
            onToggle={() => setShowConfig(!showConfig)}
          />
        </div>

        {companies.length > 0 && (
          <>
            {/* Progress and Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <ProgressStats stats={stats} isActive={isScrapingActive} />
              </div>
              
              <div className="space-y-4">
                {/* Control Buttons */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Controls</h3>
                  <div className="space-y-3">
                    {!isScrapingActive ? (
                      <button
                        onClick={handleStartScraping}
                        disabled={stats.pending === 0}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Scraping ({stats.pending})</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopScraping}
                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <Square className="w-4 h-4" />
                        <span>Stop Scraping</span>
                      </button>
                    )}

                    <button
                      onClick={handleClearAll}
                      disabled={isScrapingActive}
                      className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Export Options */}
                {successfulCompanies.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => exportToCSV(successfulCompanies)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Export CSV ({successfulCompanies.length})</span>
                      </button>
                      
                      <button
                        onClick={() => exportToJSON(successfulCompanies)}
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <Database className="w-4 h-4" />
                        <span>Export JSON ({successfulCompanies.length})</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Extraction Results ({companies.length})
                </h2>
                {stats.success > 0 && (
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">{stats.success} successful extractions</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Help Section */}
        {companies.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Started</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Search for companies or add URLs to begin extracting company data. Configure extraction settings using the configuration panel above.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Company name & website</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Contact information</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Social media links</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Business details</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;