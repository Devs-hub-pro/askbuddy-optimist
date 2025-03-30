
import { renderNavbar } from '../components/Navbar.js';
import { renderBottomNav } from '../components/BottomNav.js';

export function renderMessagesPage(container) {
  // Create the page structure
  const pageContent = document.createElement('div');
  pageContent.className = 'min-h-screen bg-gray-50 pb-20';
  
  // Render navbar
  renderNavbar(pageContent);
  
  // Main content
  const mainContent = document.createElement('div');
  mainContent.className = 'flex items-center justify-center h-[70vh]';
  mainContent.innerHTML = '<p class="text-gray-500 text-lg">消息页面正在开发中</p>';
  pageContent.appendChild(mainContent);
  
  // Render bottom nav
  renderBottomNav(pageContent);
  
  // Append everything to the container
  container.appendChild(pageContent);
}
