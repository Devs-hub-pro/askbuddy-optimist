
import { navigateTo } from '../router.js';

export function renderSearchBar(container, onSearch, placeholder = "搜索问题/达人/话题", className = "", value = '', isEducation = false) {
  const searchBarContainer = document.createElement('div');
  searchBarContainer.className = `px-4 py-3 ${className}`;
  
  const searchBarContent = `
    <div class="relative">
      <input 
        type="text" 
        value="${value}" 
        placeholder="${placeholder}" 
        class="search-input pr-10 focus:ring-2 focus:ring-app-teal/30 shadow-sm w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-app-blue/30 transition-all shadow-soft placeholder:text-gray-400"
      />
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
    </div>
  `;
  
  searchBarContainer.innerHTML = searchBarContent;
  
  // Add event listeners
  const searchInput = searchBarContainer.querySelector('input');
  const searchButton = searchBarContainer.querySelector('svg');
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
  
  searchInput.addEventListener('focus', () => {
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/search')) {
      if (isEducation) {
        navigateTo('/education/search');
      } else {
        navigateTo('/search');
      }
    }
  });
  
  searchButton.addEventListener('click', () => {
    handleSearch();
  });
  
  function handleSearch() {
    const searchValue = searchInput.value.trim();
    if (searchValue === '') return;
    
    const currentPath = window.location.pathname;
    if (currentPath.includes('/search')) {
      if (onSearch) {
        onSearch(searchValue);
      }
    } else {
      if (isEducation) {
        navigateTo(`/education/search?q=${encodeURIComponent(searchValue)}`);
      } else {
        navigateTo(`/search?q=${encodeURIComponent(searchValue)}`);
      }
    }
  }
  
  container.appendChild(searchBarContainer);
}
