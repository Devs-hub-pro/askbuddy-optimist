
import { createElement } from '../router.js';

export function renderCategorySection() {
  const categoriesSection = createElement('div', { className: 'px-4 py-5 bg-white' });
  
  const grid = createElement('div', { className: 'grid grid-cols-4 gap-3' });
  
  // Category data
  const categories = [
    {
      title: '职场发展',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17V3h9v18H3V9h9Z"/><path d="M3 9h9V3"/></svg>`,
      color: 'bg-blue-500',
      delay: 0.1
    },
    {
      title: '考研考证',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 17h5a4 4 0 1 0 0-8H5a4 4 0 1 1 0-8h8"/></svg>`,
      color: 'bg-purple-500',
      delay: 0.2
    },
    {
      title: '留学申请',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      color: 'bg-green-500',
      delay: 0.3
    },
    {
      title: '高考咨询',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"/><path d="M12 13v8"/><path d="M5 13v6a2 2 0 0 0 2 2h8"/></svg>`,
      color: 'bg-red-500',
      delay: 0.4
    },
    {
      title: '财务规划',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6"/><path d="M12 18v2"/><path d="M12 6V4"/></svg>`,
      color: 'bg-yellow-500',
      delay: 0.5
    },
    {
      title: '心理咨询',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
      color: 'bg-pink-500',
      delay: 0.6
    },
    {
      title: '生活服务',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
      color: 'bg-cyan-500',
      delay: 0.7
    },
    {
      title: '更多分类',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
      color: 'bg-gray-500',
      delay: 0.8
    }
  ];
  
  // Create category items
  categories.forEach(category => {
    const categoryItem = createElement('div', { 
      className: 'flex flex-col items-center space-y-2 animate-fade-in cursor-pointer',
      style: `animation-delay: ${category.delay}s`
    });
    
    const iconContainer = createElement('div', { 
      className: `category-icon ${category.color}` 
    });
    iconContainer.innerHTML = category.icon;
    
    const categoryTitle = createElement('span', { className: 'text-xs text-center' }, category.title);
    
    categoryItem.appendChild(iconContainer);
    categoryItem.appendChild(categoryTitle);
    
    categoryItem.addEventListener('click', () => {
      // Handle category click
      const categoryPath = category.title.replace(/\s+/g, '-').toLowerCase();
      window.history.pushState({}, '', `/${categoryPath}`);
      document.dispatchEvent(new Event('popstate'));
    });
    
    grid.appendChild(categoryItem);
  });
  
  categoriesSection.appendChild(grid);
  
  return categoriesSection;
}
