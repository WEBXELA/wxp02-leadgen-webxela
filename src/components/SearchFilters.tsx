import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchFiltersState } from '../types';

interface Props {
  filters: SearchFiltersState;
  onFilterChange: (key: keyof SearchFiltersState, value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export default function SearchFilters({ filters, onFilterChange, onSearch, isLoading }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            value={filters.jobTitle}
            onChange={(e) => onFilterChange('jobTitle', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Software Engineer"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            value={filters.company}
            onChange={(e) => onFilterChange('company', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Google"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. San Francisco"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Industry</label>
          <input
            type="text"
            value={filters.industry}
            onChange={(e) => onFilterChange('industry', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Technology"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Company Size</label>
          <select
            value={filters.companySize}
            onChange={(e) => onFilterChange('companySize', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501+">501+ employees</option>
          </select>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Experience Level</label>
          <select
            value={filters.experience}
            onChange={(e) => onFilterChange('experience', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Experience</option>
            <option value="internship">Internship</option>
            <option value="entry">Entry Level</option>
            <option value="associate">Associate</option>
            <option value="mid-senior">Mid-Senior Level</option>
            <option value="director">Director</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Education</label>
          <select
            value={filters.education}
            onChange={(e) => onFilterChange('education', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Education</option>
            <option value="high-school">High School</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">Ph.D.</option>
          </select>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Skills</label>
          <input
            type="text"
            value={filters.skills}
            onChange={(e) => onFilterChange('skills', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Python, React"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Languages</label>
          <input
            type="text"
            value={filters.languages}
            onChange={(e) => onFilterChange('languages', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. English, Spanish"
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">Seniority Level</label>
          <select
            value={filters.seniority}
            onChange={(e) => onFilterChange('seniority', e.target.value)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Level</option>
            <option value="junior">Junior</option>
            <option value="mid-level">Mid Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="manager">Manager</option>
            <option value="director">Director</option>
            <option value="vp">VP</option>
            <option value="cxo">C-Level</option>
          </select>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSearch}
        disabled={isLoading}
        className="mt-4 sm:mt-6 w-full bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{isLoading ? 'Searching...' : 'Find Profiles'}</span>
      </motion.button>
    </motion.div>
  );
}