import React, { useState } from 'react';
import { ExternalLink, MapPin, Building, GraduationCap, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '../types';

interface Props {
  profiles: Profile[];
  platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter';
}

export default function ProfileList({ profiles, platform }: Props) {
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);

  const toggleProfile = (profileLink: string) => {
    setExpandedProfile(expandedProfile === profileLink ? null : profileLink);
  };

  const getPlatformText = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return 'LinkedIn';
      case 'instagram':
        return 'Instagram';
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'Twitter';
      default:
        return 'Profile';
    }
  };

  const handleOpenProfile = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const shouldShowImage = (platform: string) => {
    return platform === 'linkedin' || platform === 'twitter';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 space-y-4"
    >
      {profiles.map((profile, index) => (
        <motion.div
          key={profile.link}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start space-x-4">
            {shouldShowImage(platform) && profile.profileImageUrl && (
              <img 
                src={profile.profileImageUrl} 
                alt={profile.fullName}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profile.fullName || profile.title}
                  </h3>
                  {profile.currentPosition && (
                    <p className="text-gray-600">{profile.currentPosition}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleProfile(profile.link)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {expandedProfile === profile.link ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenProfile(profile.link)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">View on {getPlatformText(platform)}</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {profile.company && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{profile.company}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.education && profile.education.length > 0 && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{profile.education[0].school} - {profile.education[0].degree}</span>
                  </div>
                )}
                {profile.followers > 0 && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
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
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
                        <p className="text-gray-600">{profile.about}</p>
                      </div>
                    )}

                    {profile.education && profile.education.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Education</h4>
                        <div className="space-y-2">
                          {profile.education.map((edu, i) => (
                            <div key={i} className="text-gray-600">
                              <div className="font-medium">{edu.school}</div>
                              <div>{edu.degree} • {edu.field}</div>
                              <div className="text-sm text-gray-500">{edu.years}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.connectionDegree && (
                      <div className="text-sm text-gray-500">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded-full">
                          {profile.connectionDegree} connection
                        </span>
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