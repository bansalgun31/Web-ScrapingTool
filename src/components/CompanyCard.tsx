import React from 'react';
import { Building2, Globe, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { CompanyData } from '../types/scraper';

interface CompanyCardProps {
  company: CompanyData;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const getStatusColor = (status: CompanyData['status']) => {
    switch (status) {
      case 'success': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'scraping': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: CompanyData['status']) => {
    switch (status) {
      case 'success': return 'Extracted';
      case 'error': return 'Failed';
      case 'scraping': return 'Scraping...';
      default: return 'Pending';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {company.companyName || 'Unknown Company'}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(company.status)}`}>
              {getStatusText(company.status)}
            </span>
          </div>
        </div>
      </div>

      {company.status === 'error' && company.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{company.error}</p>
        </div>
      )}

      <div className="space-y-3">
        {company.websiteUrl && (
          <div className="flex items-center space-x-2 text-sm">
            <Globe className="w-4 h-4 text-gray-500" />
            <a 
              href={company.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline truncate"
            >
              {company.websiteUrl}
            </a>
          </div>
        )}

        {company.email && (
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <a 
              href={`mailto:${company.email}`}
              className="text-gray-700 hover:text-blue-600 hover:underline"
            >
              {company.email}
            </a>
          </div>
        )}

        {company.phone && (
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-gray-500" />
            <a 
              href={`tel:${company.phone}`}
              className="text-gray-700 hover:text-blue-600 hover:underline"
            >
              {company.phone}
            </a>
          </div>
        )}

        {company.address && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{company.address}</span>
          </div>
        )}

        {company.employeeCount && (
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{company.employeeCount} employees</span>
          </div>
        )}

        {company.founded && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Founded {company.founded}</span>
          </div>
        )}

        {company.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-3">{company.description}</p>
          </div>
        )}

        {company.socialMedia && Object.keys(company.socialMedia).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Social Media</p>
            <div className="flex space-x-2">
              {company.socialMedia.linkedin && (
                <a 
                  href={company.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {company.socialMedia.twitter && (
                <a 
                  href={company.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs hover:underline"
                >
                  Twitter
                </a>
              )}
              {company.socialMedia.facebook && (
                <a 
                  href={company.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs hover:underline"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Extracted {new Date(company.extractedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};