
import { renderHomePage } from './pages/Index.js';
import { renderDiscoverPage } from './pages/Discover.js';
import { renderNotFoundPage } from './pages/NotFound.js';
import { renderProfilePage } from './pages/Profile.js';
import { renderMessagesPage } from './pages/Messages.js';
import { renderNewQuestionPage } from './pages/NewQuestion.js';

// Main routes map
const routes = {
  '/': renderHomePage,
  '/discover': renderDiscoverPage,
  '/profile': renderProfilePage,
  '/messages': renderMessagesPage,
  '/new': renderNewQuestionPage,
  // Add other routes as needed
};

// Initialize the router
export function initRouter() {
  // Render initial page
  navigateTo(window.location.pathname);
  
  // Handle navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href').startsWith('/')) {
      e.preventDefault();
      navigateTo(link.getAttribute('href'));
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    renderPage(window.location.pathname);
  });
}

// Navigate to a specific route
export function navigateTo(path) {
  window.history.pushState({}, '', path);
  renderPage(path);
}

// Render the page based on the current path
function renderPage(path) {
  const root = document.getElementById('root');
  
  // Clear the root element
  root.innerHTML = '';
  
  // Add app-container wrapper
  const appContainer = document.createElement('div');
  appContainer.className = 'app-container';
  root.appendChild(appContainer);
  
  // Find and render the matching route, or 404
  const render = routes[path] || renderNotFoundPage;
  render(appContainer);
}
