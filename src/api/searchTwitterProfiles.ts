import axios from 'axios';
import { SearchFiltersState, Profile, SearchResponse } from '../types';

const GOOGLE_API_KEY = 'AIzaSyDRBVMtIJUg1t66lj57OotJaIzr6GVEknU';
const SEARCH_ENGINE_ID = '2767c49a9a67b46c9';
const RESULTS_PER_PAGE = 10;

export async function searchTwitterProfiles(filters: SearchFiltersState): Promise<SearchResponse> {
  try {
    const startIndex = (filters.page - 1) * RESULTS_PER_PAGE + 1;
    const query = `site:twitter.com ${filters.jobTitle} ${filters.location} ${filters.industry} ${filters.company} ${filters.skills}`.trim();
    
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

    const profiles: Profile[] = response.data.items.map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      snippet: item.snippet || '',
      fullName: item.title?.split(' (@')[0] || '',
      currentPosition: '',
      company: '',
      education: [],
      location: '',
      followers: 0,
      connectionDegree: '',
      about: item.snippet || '',
      profileImageUrl: item.pagemap?.cse_image?.[0]?.src || ''
    }));

    const totalResults = Math.min(response.data.searchInformation?.totalResults || 0, 100);
    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

    return {
      items: profiles,
      totalResults,
      currentPage: filters.page,
      totalPages
    };
  } catch (error) {
    console.error('Search Twitter profiles error:', error);
    return {
      items: [],
      totalResults: 0,
      currentPage: filters.page,
      totalPages: 0
    };
  }
}