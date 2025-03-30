
import { navigateTo } from '../router.js';

export function renderNavbar(container, location = "深圳") {
  const header = document.createElement('header');
  header.className = "sticky top-0 z-50 bg-app-teal animate-fade-in shadow-sm";
  
  const headerContent = `
    <div class="flex items-center justify-between h-12 px-4">
      <div class="text-white font-medium text-sm">问问</div>
      
      <div class="flex items-center gap-3">
        <button class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-white" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button class="flex items-center space-x-1 text-white font-medium text-sm px-2 py-1 rounded-full bg-white/20" id="location-selector">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-white" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${location}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  header.innerHTML = headerContent;
  
  // Add event listener for location selector
  const locationSelector = header.querySelector('#location-selector');
  locationSelector.addEventListener('click', () => {
    navigateTo('/city-selector');
  });
  
  container.appendChild(header);
}
