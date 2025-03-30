
import { createElement } from '../router.js';

export function renderNotFoundPage(container) {
  const notFoundContainer = createElement('div', { className: 'min-h-screen flex items-center justify-center bg-gray-100' });
  
  const content = createElement('div', { className: 'text-center' });
  
  const title = createElement('h1', { className: 'text-4xl font-bold mb-4' }, '404');
  const message = createElement('p', { className: 'text-xl text-gray-600 mb-4' }, 'Oops! Page not found');
  
  const homeLink = createElement('a', { 
    href: '/',
    className: 'text-blue-500 hover:text-blue-700 underline'
  }, 'Return to Home');
  
  content.appendChild(title);
  content.appendChild(message);
  content.appendChild(homeLink);
  
  notFoundContainer.appendChild(content);
  container.appendChild(notFoundContainer);
  
  // Log error to console
  console.error(
    "404 Error: User attempted to access non-existent route:",
    window.location.pathname
  );
  
  return container;
}
