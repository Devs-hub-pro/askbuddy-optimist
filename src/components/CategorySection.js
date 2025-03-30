
import { navigateTo } from '../router.js';

export function renderCategorySection(container) {
  const categories = [
    {
      id: 'education',
      name: '教育学习',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
      color: 'bg-app-blue',
      gradient: 'from-blue-400 to-indigo-500',
      path: '/education'
    },
    {
      id: 'career',
      name: '职业发展',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      color: 'bg-app-green',
      gradient: 'from-green-400 to-teal-500',
      path: '/career'
    },
    {
      id: 'lifestyle',
      name: '生活服务',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      color: 'bg-app-orange',
      gradient: 'from-orange-400 to-amber-500',
      path: '/lifestyle'
    },
    {
      id: 'hobbies',
      name: '兴趣技能',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
      color: 'bg-app-red',
      gradient: 'from-pink-400 to-rose-500',
      path: '/hobbies'
    }
  ];

  const sectionContainer = document.createElement('div');
  sectionContainer.className = 'py-6 px-4 animate-fade-in animate-delay-1';
  
  let categoriesHTML = `<div class="grid grid-cols-4 gap-3">`;
  
  categories.forEach((category, index) => {
    categoriesHTML += `
      <div class="flex flex-col items-center animate-slide-up cursor-pointer" 
           style="animation-delay: ${index * 0.1 + 0.2}s" 
           data-path="${category.path}">
        <div class="category-icon mb-2 bg-gradient-to-br ${category.gradient} shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 rounded-xl">
          ${category.icon}
        </div>
        <span class="text-xs text-center font-medium">${category.name}</span>
      </div>
    `;
  });
  
  categoriesHTML += `</div>`;
  sectionContainer.innerHTML = categoriesHTML;
  
  // Add event listeners for category clicks
  const categoryElements = sectionContainer.querySelectorAll('.flex.flex-col');
  categoryElements.forEach(element => {
    element.addEventListener('click', () => {
      const path = element.dataset.path;
      navigateTo(path);
    });
  });
  
  container.appendChild(sectionContainer);
}
