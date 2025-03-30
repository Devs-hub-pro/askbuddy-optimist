
import { createElement } from '../router.js';

export function renderBottomNav() {
  const nav = createElement('nav', { 
    className: 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 shadow-top z-40' 
  });
  
  const navList = createElement('ul', { className: 'flex justify-between items-center' });
  
  // Navigation items data
  const navItems = [
    {
      name: '首页',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      path: '/',
      isActive: true
    },
    {
      name: '发现',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
      path: '/discover',
      isActive: false
    },
    {
      name: '提问',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
      path: '/new',
      isActive: false
    },
    {
      name: '消息',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      path: '/messages',
      isActive: false
    },
    {
      name: '我的',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      path: '/profile',
      isActive: false
    }
  ];
  
  // Create navigation items
  navItems.forEach(item => {
    const listItem = createElement('li', {});
    
    const navLink = createElement('a', { 
      href: item.path,
      className: `nav-item ${item.isActive ? 'active' : ''}`
    });
    
    const iconContainer = createElement('div', {});
    iconContainer.innerHTML = item.icon;
    
    const label = createElement('span', { className: 'text-xs' }, item.name);
    
    navLink.appendChild(iconContainer);
    navLink.appendChild(label);
    listItem.appendChild(navLink);
    navList.appendChild(listItem);
  });
  
  nav.appendChild(navList);
  
  return nav;
}
