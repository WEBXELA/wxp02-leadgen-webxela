import React, { useState } from 'react';
import { ExternalLink, MapPin, Building, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '../types';

interface Props {
  profiles: Profile[];
  platform: string;
}

export default function ProfileList({ profiles, platform }: Props) {
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const toggleProfile = (profileLink: string) => {
    setExpandedProfile(expandedProfile === profileLink ? null : profileLink);
  };

  const handleImageError = (profileUrl: string) => {
    setFailedImages(prev => new Set(prev).add(profileUrl));
  };

  const getPlatformSpecificIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'https://i.imgur.com/FsWOKYo.png';
      case 'facebook':
        return 'https://i.imgur.com/jQNPGwE.png';
      case 'twitter':
        return 'https://i.imgur.com/0yZgvet.png';
      default:
        return 'https://i.imgur.com/U9Q1cGd.png';
    }
  };

  const formatProfileUrl = (url: string, platform: string) => {
    if (!url) return '#';
    
    switch (platform) {
      case 'linkedin':
        if (!url.includes('linkedin.com/in/')) {
          const username = url.split('/').pop();
          return `https://www.linkedin.com/in/${username}`;
        }
        return url.startsWith('http') ? url : `https://${url}`;
      case 'instagram':
        return url.startsWith('http') ? url : `https://instagram.com/${url.replace('@', '')}`;
      case 'facebook':
        return url.startsWith('http') ? url : `https://facebook.com/${url}`;
      case 'twitter':
        return url.startsWith('http') ? url : `https://twitter.com/${url.replace('@', '')}`;
      default:
        return url;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6 sm:mt-8 space-y-3 sm:space-y-4"
    >
      {profiles.map((profile, index) => (
        <motion.div
          key={profile.link}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <img 
              src={failedImages.has(profile.link) ? getPlatformSpecificIcon(platform) : (profile.profileImageUrl || getPlatformSpecificIcon(platform))}
              alt={profile.fullName}
              onError={() => handleImageError(profile.link)}
              className="w-16 h-16 rounded-full object-cover bg-gray-100 mx-auto sm:mx-0"
            />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {profile.fullName || profile.title}
                  </h3>
                  {profile.currentPosition && (
                    <p className="text-sm sm:text-base text-gray-600">{profile.currentPosition}</p>
                  )}
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => toggleProfile(profile.link)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {expandedProfile === profile.link ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                  <a
                    href={formatProfileUrl(profile.link, platform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>View on {platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                  </a>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {profile.company && (
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 text-sm">
                    <Building className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{profile.company}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.followers > 0 && (
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 text-sm">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{profile.followers.toLocaleString()} followers</span>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {expandedProfile === profile.link && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    {profile.about && (
                      <div className="mb-4">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">About</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{profile.about}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}