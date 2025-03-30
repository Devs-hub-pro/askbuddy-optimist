
import { createElement } from '../router.js';

export function renderNavbar(location = "深圳") {
  const header = createElement('header', { className: 'sticky top-0 z-50 bg-app-teal animate-fade-in shadow-sm' });
  
  const container = createElement('div', { className: 'flex items-center justify-between h-12 px-4' });
  
  const logo = createElement('div', { className: 'text-white font-medium text-sm' }, '问问');
  
  const rightSection = createElement('div', { className: 'flex items-center gap-3' });
  
  const notificationButton = createElement('button', { className: 'relative' });
  notificationButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
  
  const notificationBadge = createElement('span', { className: 'absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full' });
  notificationButton.appendChild(notificationBadge);
  
  const locationButton = createElement('button', { 
    className: 'flex items-center space-x-1 text-white font-medium text-sm px-2 py-1 rounded-full bg-white/20'
  });
  
  locationButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  
  const locationText = createElement('span', {}, location);
  const chevronIcon = createElement('span', {});
  chevronIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  
  locationButton.appendChild(locationText);
  locationButton.appendChild(chevronIcon);
  
  locationButton.addEventListener('click', () => {
    window.history.pushState({}, '', '/city-selector');
    document.dispatchEvent(new Event('popstate'));
  });
  
  rightSection.appendChild(notificationButton);
  rightSection.appendChild(locationButton);
  
  container.appendChild(logo);
  container.appendChild(rightSection);
  
  header.appendChild(container);
  
  return header;
}
