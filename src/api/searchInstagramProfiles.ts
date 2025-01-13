import axios from 'axios';
import { SearchFiltersState, Profile, SearchResponse } from '../types';

const GOOGLE_API_KEY = 'AIzaSyAbzP67SAVdeIeK_ENGs0hzGbH_jhqxFNE';
const SEARCH_ENGINE_ID = 'a4bf81cbb5804487f';
const RESULTS_PER_PAGE = 10;

export async function searchInstagramProfiles(filters: SearchFiltersState): Promise<SearchResponse> {
  try {
    const startIndex = (filters.page - 1) * RESULTS_PER_PAGE + 1;
    const query = `site:instagram.com ${filters.jobTitle} ${filters.location} ${filters.industry} ${filters.company} ${filters.skills}`.trim();
    
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        num: RESULTS_PER_PAGE,
        start: startIndex
      }
    });

    if (!response.data?.items) {
      return {
        items: [],
        totalResults: 0,
        currentPage: filters.page,
        totalPages: 0
      };
    }

    const profiles: Profile[] = response.data.items.map((item: any) => {
      const bio = item.snippet || '';
      // Extract first line of bio as current position if available
      const firstLine = bio.split('.')[0].trim();
      
      return {
        title: item.title || '',
        link: item.link || '',
        snippet: item.snippet || '',
        fullName: item.title?.split(' (@')[0] || '',
        currentPosition: firstLine || '',
        company: '',
        education: [],
        location: '',
        followers: 0,
        connectionDegree: '',
        about: bio,
        profileImageUrl: ''
      };
    });

    const totalResults = Math.min(response.data.searchInformation?.totalResults || 0, 100);
    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

    return {
      items: profiles,
      totalResults,
      currentPage: filters.page,
      totalPages
    };
  } catch (error) {
    console.error('Search Instagram profiles error:', error);
    return {
      items: [],
      totalResults: 0,
      currentPage: filters.page,
      totalPages: 0
    };
  }
}