import axios from 'axios';
import { SearchFiltersState, Profile, SearchResponse } from '../types';

const GOOGLE_API_KEY = 'AIzaSyDOojV79DnbYOkkhgxZXa_nZzq_8WUcNNI';
const SEARCH_ENGINE_ID = '45949347f8b954cf9';
const RESULTS_PER_PAGE = 10;

function extractImage(item: any): string {
  return (
    item.pagemap?.metatags?.[0]?.['og:image'] ||
    item.pagemap?.cse_image?.[0]?.src ||
    item.pagemap?.imageobject?.[0]?.url ||
    ''
  );
}

export async function searchProfiles(filters: SearchFiltersState): Promise<SearchResponse> {
  try {
    const startIndex = (filters.page - 1) * RESULTS_PER_PAGE + 1;
    const query = `site:linkedin.com/in/ ${filters.jobTitle} ${filters.location} ${filters.industry} ${filters.companySize} ${filters.company} ${filters.skills} ${filters.languages}`.trim();
    
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        num: RESULTS_PER_PAGE,
        start: startIndex,
        searchType: 'image'
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
      fullName: item.title?.split(' - ')[0] || '',
      currentPosition: item.title?.split(' - ')[1] || '',
      company: item.title?.split(' - ')[2] || '',
      education: [],
      location: '',
      followers: 0,
      connectionDegree: '',
      about: item.snippet || '',
      profileImageUrl: extractImage(item)
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
    console.error('Search profiles error:', error);
    return {
      items: [],
      totalResults: 0,
      currentPage: filters.page,
      totalPages: 0
    };
  }
}