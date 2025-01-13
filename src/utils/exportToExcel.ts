import { Profile } from '../types';
import { searchProfiles } from '../api/searchProfiles';

async function fetchAllProfiles(filters: any): Promise<Profile[]> {
  const totalPages = 10; // 100 results with 10 per page
  const promises = [];
  
  for (let page = 1; page <= totalPages; page++) {
    promises.push(
      searchProfiles({ ...filters, page })
        .then(response => response.items)
    );
  }
  
  const results = await Promise.all(promises);
  return results.flat();
}

export async function exportToExcel(currentProfiles: Profile[], filters: any) {
  try {
    // Show loading state in the UI
    const downloadButton = document.querySelector('#download-button');
    if (downloadButton) {
      downloadButton.setAttribute('disabled', 'true');
      downloadButton.textContent = 'Fetching data...';
    }

    // Fetch all 100 results
    const allProfiles = await fetchAllProfiles(filters);
    
    const headers = ['Name', 'Profile URL', 'Description'];
    const csvContent = [
      headers.join(','),
      ...allProfiles.map(profile => [
        profile.title.replace(/,/g, ' '),
        profile.link,
        profile.snippet.replace(/,/g, ' ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'linkedin_profiles.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Reset button state
    if (downloadButton) {
      downloadButton.removeAttribute('disabled');
      downloadButton.textContent = 'Export to Excel';
    }
  } catch (error) {
    console.error('Export failed:', error);
    // Reset button state
    const downloadButton = document.querySelector('#download-button');
    if (downloadButton) {
      downloadButton.removeAttribute('disabled');
      downloadButton.textContent = 'Export to Excel';
    }
    alert('Failed to export data. Please try again.');
  }
}