
// main.js - New vanilla JavaScript entry point
import './index.css';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Basic router implementation
  const routes = {
    '/': homeScreen,
    '/discover': discoverScreen,
    '/profile': profileScreen,
    '/messages': messagesScreen,
    '/new': newQuestionScreen,
    '/404': notFoundScreen
  };

  // Simple navigation handling
  function navigateTo(path) {
    window.history.pushState({}, '', path);
    renderContent();
  }

  // Render the appropriate screen based on URL
  function renderContent() {
    const path = window.location.pathname;
    const renderFunction = routes[path] || routes['/404'];
    const root = document.getElementById('root');
    
    // Clear previous content
    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    
    // Render new content
    renderFunction(root);
    renderBottomNav(root);
  }

  // Setup navigation events
  window.addEventListener('popstate', renderContent);
  
  // Initial render
  renderContent();
});

// Screen rendering functions
function homeScreen(container) {
  const content = document.createElement('div');
  content.className = 'min-h-screen bg-gray-50 pb-20';
  
  // Navbar
  const navbar = createNavbar('深圳');
  content.appendChild(navbar);
  
  // Content
  const main = document.createElement('div');
  main.className = 'px-4 py-6';
  
  const heading = document.createElement('h1');
  heading.className = 'text-2xl font-bold mb-4';
  heading.textContent = '首页';
  
  main.appendChild(heading);
  content.appendChild(main);
  
  container.appendChild(content);
}

function discoverScreen(container) {
  const content = document.createElement('div');
  content.className = 'min-h-screen bg-gray-50 pb-20';
  
  // Navbar
  const navbar = createNavbar('深圳');
  content.appendChild(navbar);
  
  // Content
  const main = document.createElement('div');
  main.className = 'px-4 py-6';
  
  const heading = document.createElement('h1');
  heading.className = 'text-2xl font-bold mb-4';
  heading.textContent = '发现';
  
  main.appendChild(heading);
  content.appendChild(main);
  
  container.appendChild(content);
}

function profileScreen(container) {
  const content = document.createElement('div');
  content.className = 'min-h-screen bg-gray-50 pb-20';
  
  // Content
  const main = document.createElement('div');
  main.className = 'px-4 py-6';
  
  const heading = document.createElement('h1');
  heading.className = 'text-2xl font-bold mb-4';
  heading.textContent = '我的';
  
  main.appendChild(heading);
  content.appendChild(main);
  
  container.appendChild(content);
}

function messagesScreen(container) {
  const content = document.createElement('div');
  content.className = 'min-h-screen bg-gray-50 pb-20';
  
  // Content
  const main = document.createElement('div');
  main.className = 'px-4 py-6';
  
  const heading = document.createElement('h1');
  heading.className = 'text-2xl font-bold mb-4';
  heading.textContent = '消息';
  
  main.appendChild(heading);
  content.appendChild(main);
  
  container.appendChild(content);
}

function newQuestionScreen(container) {
  const content = document.createElement('div');
  content.className = 'min-h-screen bg-gray-50 pb-20';
  
  // Content
  const main = document.createElement('div');
  main.className = 'px-4 py-6';
  
  const heading = document.createElement('h1');
  heading.className = 'text-2xl font-bold mb-4';
  heading.textContent = '提问';
  
  main.appendChild(heading);
  content.appendChild(main);
  
  container.appendChild(content);
}

function notFoundScreen(container) {
  const content = document.createElement('div');
  content.className = 'min-h-screen flex items-center justify-center bg-gray-100';
  
  const notFoundContent = document.createElement('div');
  notFoundContent.className = 'text-center';
  
  const heading = document.createElement('h1');
  heading.className = 'text-4xl font-bold mb-4';
  heading.textContent = '404';
  
  const message = document.createElement('p');
  message.className = 'text-xl text-gray-600 mb-4';
  message.textContent = 'Oops! Page not found';
  
  const link = document.createElement('a');
  link.href = '/';
  link.className = 'text-blue-500 hover:text-blue-700 underline';
  link.textContent = 'Return to Home';
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/');
  });
  
  notFoundContent.appendChild(heading);
  notFoundContent.appendChild(message);
  notFoundContent.appendChild(link);
  content.appendChild(notFoundContent);
  
  container.appendChild(content);
  
  console.error(
    "404 Error: User attempted to access non-existent route:",
    window.location.pathname
  );
}

// UI Components
function createNavbar(location) {
  const navbar = document.createElement('header');
  navbar.className = 'sticky top-0 z-50 bg-app-teal animate-fade-in shadow-sm';
  
  const container = document.createElement('div');
  container.className = 'flex items-center justify-between h-12 px-4';
  
  const logo = document.createElement('div');
  logo.className = 'text-white font-medium text-sm';
  logo.textContent = '问问';
  
  const rightSection = document.createElement('div');
  rightSection.className = 'flex items-center gap-3';
  
  // Bell button
  const bellButton = document.createElement('button');
  bellButton.className = 'relative';
  
  const bellIcon = document.createElement('div');
  bellIcon.className = 'text-white';
  bellIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>`;
  
  const bellDot = document.createElement('span');
  bellDot.className = 'absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full';
  
  bellButton.appendChild(bellIcon);
  bellButton.appendChild(bellDot);
  
  // Location button
  const locationButton = document.createElement('button');
  locationButton.className = 'flex items-center space-x-1 text-white font-medium text-sm px-2 py-1 rounded-full bg-white/20';
  
  const pinIcon = document.createElement('div');
  pinIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
  
  const locationText = document.createElement('span');
  locationText.textContent = location;
  
  const chevronIcon = document.createElement('div');
  chevronIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>`;
  
  locationButton.appendChild(pinIcon);
  locationButton.appendChild(locationText);
  locationButton.appendChild(chevronIcon);
  
  locationButton.addEventListener('click', () => {
    alert('City selector will be implemented here');
  });
  
  rightSection.appendChild(bellButton);
  rightSection.appendChild(locationButton);
  
  container.appendChild(logo);
  container.appendChild(rightSection);
  navbar.appendChild(container);
  
  return navbar;
}

function renderBottomNav(container) {
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 max-w-md mx-auto shadow-xl';
  
  const navContent = document.createElement('div');
  navContent.className = 'flex items-center justify-around h-16';
  
  // Define navigation items
  const navItems = [
    { path: '/', label: '首页', icon: 'home' },
    { path: '/discover', label: '发现', icon: 'compass' },
    { path: '/new', label: '提问', icon: 'plus', special: true },
    { path: '/messages', label: '消息', icon: 'message-square', notification: true },
    { path: '/profile', label: '我的', icon: 'user' }
  ];
  
  // Current path
  const currentPath = window.location.pathname;
  
  // Create each navigation item
  navItems.forEach(item => {
    const button = document.createElement('button');
    
    if (item.special) {
      button.className = 'w-1/5 flex flex-col items-center justify-center transform -translate-y-5';
      
      const plusCircle = document.createElement('div');
      plusCircle.className = 'w-14 h-14 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow hover:scale-105 transition-transform duration-200';
      
      const plusIcon = document.createElement('div');
      plusIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>`;
      
      plusCircle.appendChild(plusIcon);
      
      const label = document.createElement('span');
      label.className = 'text-xs mt-1 text-gray-700 font-medium';
      label.textContent = item.label;
      
      button.appendChild(plusCircle);
      button.appendChild(label);
    } else {
      button.className = `nav-item flex flex-col items-center justify-center w-1/5 py-1 ${currentPath === item.path ? 'active' : ''}`;
      
      const iconContainer = document.createElement('div');
      iconContainer.className = 'relative';
      
      // Create the appropriate icon based on item.icon
      let iconSvg = '';
      switch (item.icon) {
        case 'home':
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
          break;
        case 'compass':
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`;
          break;
        case 'message-square':
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
          break;
        case 'user':
          iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
          break;
      }
      
      const icon = document.createElement('div');
      icon.className = currentPath === item.path ? "text-app-teal" : "text-gray-400";
      icon.innerHTML = iconSvg;
      
      iconContainer.appendChild(icon);
      
      if (currentPath === item.path) {
        const activeDot = document.createElement('span');
        activeDot.className = 'absolute -top-1 -right-1 w-2 h-2 bg-app-teal rounded-full';
        iconContainer.appendChild(activeDot);
      }
      
      if (item.notification) {
        const notificationDot = document.createElement('span');
        notificationDot.className = 'absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full';
        iconContainer.appendChild(notificationDot);
      }
      
      const label = document.createElement('span');
      label.className = currentPath === item.path 
        ? "text-xs mt-1 text-app-teal font-medium" 
        : "text-xs mt-1 text-gray-500";
      label.textContent = item.label;
      
      button.appendChild(iconContainer);
      button.appendChild(label);
    }
    
    // Add click event
    button.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.path);
    });
    
    navContent.appendChild(button);
  });
  
  bottomNav.appendChild(navContent);
  container.appendChild(bottomNav);
}

// Expose navigation for global use
window.navigateTo = navigateTo;
