
import { navigateTo } from '../router.js';

export function renderBottomNav(container) {
  const nav = document.createElement('nav');
  nav.className = "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 max-w-md mx-auto shadow-xl";
  
  const currentPath = window.location.pathname;
  
  const navContent = `
    <div class="flex items-center justify-around h-16">
      <button 
        id="nav-home"
        class="nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/' ? 'active' : ''}"
      >
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${currentPath === '/' ? 'text-app-teal' : 'text-gray-400'}">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          ${currentPath === '/' ? '<span class="absolute -top-1 -right-1 w-2 h-2 bg-app-teal rounded-full"></span>' : ''}
        </div>
        <span class="text-xs mt-1 ${currentPath === '/' ? 'text-app-teal font-medium' : 'text-gray-500'}">首页</span>
      </button>
      
      <button 
        id="nav-discover"
        class="nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/discover' ? 'active' : ''}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${currentPath === '/discover' ? 'text-app-teal' : 'text-gray-400'}">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
        <span class="text-xs mt-1 ${currentPath === '/discover' ? 'text-app-teal font-medium' : 'text-gray-500'}">发现</span>
      </button>
      
      <button 
        id="nav-new"
        class="w-1/5 flex flex-col items-center justify-center transform -translate-y-5"
      >
        <div class="w-14 h-14 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow hover:scale-105 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </div>
        <span class="text-xs mt-1 text-gray-700 font-medium">提问</span>
      </button>
      
      <button 
        id="nav-messages"
        class="nav-item flex flex-col items-center justify-center w-1/5 py-1 relative ${currentPath === '/messages' ? 'active' : ''}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${currentPath === '/messages' ? 'text-app-teal' : 'text-gray-400'}">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        </svg>
        <span class="absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full"></span>
        <span class="text-xs mt-1 ${currentPath === '/messages' ? 'text-app-teal font-medium' : 'text-gray-500'}">消息</span>
      </button>
      
      <button 
        id="nav-profile"
        class="nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === '/profile' ? 'active' : ''}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${currentPath === '/profile' ? 'text-app-teal' : 'text-gray-400'}">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span class="text-xs mt-1 ${currentPath === '/profile' ? 'text-app-teal font-medium' : 'text-gray-500'}">我的</span>
      </button>
    </div>
  `;
  
  nav.innerHTML = navContent;
  
  // Add event listeners
  nav.querySelector('#nav-home').addEventListener('click', () => navigateTo('/'));
  nav.querySelector('#nav-discover').addEventListener('click', () => navigateTo('/discover'));
  nav.querySelector('#nav-new').addEventListener('click', () => navigateTo('/new'));
  nav.querySelector('#nav-messages').addEventListener('click', () => navigateTo('/messages'));
  nav.querySelector('#nav-profile').addEventListener('click', () => navigateTo('/profile'));
  
  container.appendChild(nav);
}
