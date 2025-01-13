import axios from 'axios';
import { SearchFiltersState, Profile, SearchResponse } from '../types';

const GOOGLE_API_KEY = 'AIzaSyASxF3lOLKCi48tko2DFIOmzoYr971UU0w';
const SEARCH_ENGINE_ID = '0362cbd855cda45ca';
const RESULTS_PER_PAGE = 10;

export async function searchFacebookProfiles(filters: SearchFiltersState): Promise<SearchResponse> {
  try {
    const startIndex = (filters.page - 1) * RESULTS_PER_PAGE + 1;
    const query = `site:facebook.com ${filters.jobTitle} ${filters.location} ${filters.industry} ${filters.company} ${filters.skills}`.trim();
    
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
        fullName: item.title?.split(' |')[0] || '',
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
    console.error('Search Facebook profiles error:', error);
    return {
      items: [],
      totalResults: 0,
      currentPage: filters.page,
      totalPages: 0
    };
  }
}