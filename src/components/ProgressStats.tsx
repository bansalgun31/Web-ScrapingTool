import React from 'react';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import { ScrapingStats } from '../types/scraper';

interface ProgressStatsProps {
  stats: ScrapingStats;
  isActive: boolean;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({ stats, isActive }) => {
  const completedPercentage = stats.total > 0 ? Math.round(((stats.success + stats.failed) / stats.total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Scraping Progress</h3>
        {isActive && (
          <div className="flex items-center space-x-2">
            <Loader className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-600 font-medium">Running...</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completedPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.success}</p>
          <p className="text-sm text-gray-600">Success</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          <p className="text-sm text-gray-600">Failed</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Loader className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
      </div>
    </div>
  );
};