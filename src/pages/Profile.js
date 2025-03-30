
import { renderNavbar } from '../components/Navbar.js';
import { renderBottomNav } from '../components/BottomNav.js';
import { navigateTo } from '../router.js';

export function renderProfilePage(container) {
  // Create the page structure
  const pageContent = document.createElement('div');
  pageContent.className = 'min-h-screen bg-gray-50 pb-20';
  
  // Mock user data
  const userData = {
    name: '张小明',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    badge: '资深留学顾问',
    level: 'Lv.3',
    points: '520',
    stats: {
      orders: 12,
      answers: 5,
      favorites: 23,
      following: 8
    }
  };
  
  // Define menu sections
  const profileFeatures = [
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-app-blue"><line x1="8" x2="21" y1="6" y2="6"></line><line x1="8" x2="21" y1="12" y2="12"></line><line x1="8" x2="21" y1="18" y2="18"></line><line x1="3" x2="3.01" y1="6" y2="6"></line><line x1="3" x2="3.01" y1="12" y2="12"></line><line x1="3" x2="3.01" y1="18" y2="18"></line></svg>', label: '我的订单', route: '/profile/orders' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-app-green"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" x2="6" y1="2" y2="4"></line><line x1="10" x2="10" y1="2" y2="4"></line><line x1="14" x2="14" y1="2" y2="4"></line></svg>', label: '我的回答', route: '/profile/answers' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-app-red"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>', label: '我的收藏', route: '/profile/favorites' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>', label: '我的关注', route: '/profile/following' },
  ];
  
  // Render content
  const headerHTML = `
    <div class="bg-gradient-to-r from-app-blue to-app-teal text-white pt-14 pb-8 px-4 rounded-b-3xl shadow-md relative">
      <div class="absolute right-4 top-6">
        <button id="settings-button" class="text-white hover:bg-white/20 transition-colors p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </button>
      </div>

      <div class="flex items-center">
        <div class="h-22 w-22 border-2 border-white ring-2 ring-white/30 shadow-lg rounded-full overflow-hidden">
          <img src="${userData.avatar}" alt="${userData.name}" class="w-full h-full object-cover" />
        </div>
        <div class="ml-4 flex-1">
          <div class="flex flex-col">
            <div class="flex items-center mb-2">
              <h2 class="text-xl font-bold">${userData.name}</h2>
              <span class="ml-2 bg-white/20 text-white border-none px-2 py-0.5 text-xs backdrop-blur-sm rounded-md">
                ${userData.badge}
              </span>
            </div>
            <div class="flex items-center text-sm mb-3 space-x-2">
              <div class="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                ${userData.level}
              </div>
              <div class="flex items-center bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2l3 6.3 7 1-5 4.8 1.2 6.9-6.2-3.2Z"></path></svg>
                <span>${userData.points} 积分</span>
              </div>
            </div>
            <button 
              id="edit-profile-button"
              class="bg-white/10 border border-white/30 text-white hover:bg-white/30 hover:text-white w-fit flex items-center gap-1.5 px-3 py-1 rounded-md text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              编辑资料
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // User Stats
  const statsHTML = `
    <div class="px-4 -mt-6">
      <div class="border-none shadow-lg overflow-hidden rounded-xl bg-white">
        <div class="grid grid-cols-4">
          ${profileFeatures.map((item, index) => `
            <div 
              class="flex flex-col items-center py-4 cursor-pointer hover:bg-gray-50 transition-colors ${index < profileFeatures.length - 1 ? 'border-r border-gray-100' : ''}"
              data-route="${item.route}"
            >
              <span class="text-lg font-semibold mb-1" style="color: ${index === 0 ? '#0D99FF' : index === 1 ? '#00C781' : index === 2 ? '#FF5A5F' : '#8B5CF6'}">
                ${userData.stats[Object.keys(userData.stats)[index]]}
              </span>
              <span class="text-xs text-gray-500">${item.label.replace('我的', '')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  pageContent.innerHTML = headerHTML + statsHTML;
  
  // Add event listeners
  const editProfileButton = pageContent.querySelector('#edit-profile-button');
  editProfileButton.addEventListener('click', () => {
    navigateTo('/edit-profile');
  });
  
  const settingsButton = pageContent.querySelector('#settings-button');
  settingsButton.addEventListener('click', () => {
    alert('设置功能正在开发中');
  });
  
  const statItems = pageContent.querySelectorAll('[data-route]');
  statItems.forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.route);
    });
  });
  
  // Render bottom nav
  renderBottomNav(pageContent);
  
  // Append everything to the container
  container.appendChild(pageContent);
}
