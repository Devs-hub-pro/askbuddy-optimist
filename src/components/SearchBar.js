
import { createElement } from '../router.js';

export function renderSearchBar() {
  const searchContainer = createElement('div', { className: 'relative' });
  
  const searchInput = createElement('input', {
    type: 'text',
    placeholder: '搜索问题、专业人士、话题...',
    className: 'search-input w-full'
  });
  
  const searchIcon = createElement('div', { 
    className: 'absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400' 
  });
  
  searchIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
  
  // Add search functionality
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        window.history.pushState({ searchTerm }, '', `/search?q=${encodeURIComponent(searchTerm)}`);
        document.dispatchEvent(new Event('popstate'));
      }
    }
  });
  
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchIcon);
  
  return searchContainer;
}
