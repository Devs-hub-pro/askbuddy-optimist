
import { renderHomePage } from './pages/Index.js';
import { renderNotFoundPage } from './pages/NotFound.js';

// Simple router to handle different routes
export function initRouter() {
  const root = document.getElementById('root');
  
  // Function to render the correct page based on URL
  function renderPage() {
    const path = window.location.pathname;
    
    // Clear the root element
    root.innerHTML = '';
    
    // Create app container
    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';

    // Render the appropriate page based on path
    switch (path) {
      case '/':
      case '/index':
        renderHomePage(appContainer);
        break;
      default:
        renderNotFoundPage(appContainer);
    }
    
    // Append the app container to the root
    root.appendChild(appContainer);
  }
  
  // Initial render
  renderPage();
  
  // Handle navigation
  document.addEventListener('click', (e) => {
    // Check if the clicked element is an anchor tag
    const anchor = e.target.closest('a');
    if (anchor && anchor.getAttribute('href').startsWith('/')) {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      window.history.pushState({}, '', href);
      renderPage();
    }
  });
  
  // Handle browser back/forward navigation
  window.addEventListener('popstate', renderPage);
}

// Helper function to create elements with attributes and children
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'onClick') {
      element.addEventListener('click', value);
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Append children
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child) {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      }
    });
  } else if (children) {
    if (typeof children === 'string') {
      element.appendChild(document.createTextNode(children));
    } else {
      element.appendChild(children);
    }
  }
  
  return element;
}
