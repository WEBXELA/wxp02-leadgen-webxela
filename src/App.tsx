import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  Users,
  Download,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  LogOut,
  Menu,
  Search,
} from 'lucide-react';
import SearchFilters from './components/SearchFilters';
import ProfileList from './components/ProfileList';
import Pagination from './components/Pagination';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { searchProfiles } from './api/searchProfiles';
import { searchInstagramProfiles } from './api/searchInstagramProfiles';
import { searchFacebookProfiles } from './api/searchFacebookProfiles';
import { searchTwitterProfiles } from './api/searchTwitterProfiles';
import { exportToExcel } from './utils/exportToExcel';
import { SearchFiltersState, Profile, SearchResponse } from './types';
import { supabase } from './lib/supabase';

const platformIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
};

const platformNames = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
};

function Dashboard() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersState>({
    jobTitle: '',
    location: '',
    industry: '',
    companySize: '',
    company: '',
    experience: '',
    education: '',
    skills: '',
    languages: '',
    seniority: '',
    page: 1,
    platform: 'linkedin'
  });

  const { data: searchResponse, isLoading, refetch } = useQuery<SearchResponse>(
    ['profiles', filters],
    () => {
      switch (filters.platform) {
        case 'instagram':
          return searchInstagramProfiles(filters);
        case 'facebook':
          return searchFacebookProfiles(filters);
        case 'twitter':
          return searchTwitterProfiles(filters);
        default:
          return searchProfiles(filters);
      }
    },
    {
      enabled: false,
      keepPreviousData: true
    }
  );

  const handleFilterChange = (key: keyof SearchFiltersState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
    refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    refetch();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToExcel(searchResponse?.items || [], filters);
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  WEBXELA LEADGEN
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Professional Lead Generation Tool
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="sm:hidden bg-white shadow-lg rounded-lg p-4 mb-4"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign out</span>
              </button>
            </motion.div>
          )}

          <div className="flex flex-wrap justify-center gap-2 sm:space-x-4 mt-4 sm:mt-6">
            {Object.entries(platformIcons).map(([key, Icon]) => (
              <button
                key={key}
                onClick={() => handleFilterChange('platform', key as any)}
                className={`p-2 sm:p-3 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors ${
                  filters.platform === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{platformNames[key]}</span>
              </button>
            ))}
          </div>

          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="flex justify-center mt-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Users className="w-8 h-8 text-blue-600" />
              </motion.div>
            </div>
          )}

          {searchResponse?.items && searchResponse.items.length > 0 && (
            <>
              <div className="flex justify-end mt-6 sm:mt-8">
                <motion.button
                  id="download-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>
                    {isExporting ? 'Fetching data...' : 'Export to Excel'}
                  </span>
                </motion.button>
              </div>
              <ProfileList
                profiles={searchResponse.items}
                platform={filters.platform}
              />
              <Pagination
                currentPage={searchResponse.currentPage}
                totalPages={searchResponse.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {searchResponse?.items && searchResponse.items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8 text-gray-600 text-sm sm:text-base"
            >
              No profiles found matching your criteria. Try adjusting your
              filters.
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} webxela.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}