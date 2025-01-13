export interface SearchFiltersState {
  jobTitle: string;
  location: string;
  industry: string;
  companySize: string;
  company: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  seniority: string;
  page: number;
  platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter';
}

export interface ProfileEducation {
  school: string;
  degree: string;
  field: string;
  years: string;
}

export interface Profile {
  title: string;
  link: string;
  snippet: string;
  fullName: string;
  currentPosition: string;
  company: string;
  education: ProfileEducation[];
  location: string;
  followers: number;
  connectionDegree: string;
  about: string;
  profileImageUrl: string;
}

export interface SearchResponse {
  items: Profile[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}