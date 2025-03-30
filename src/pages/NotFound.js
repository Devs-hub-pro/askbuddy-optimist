
import { navigateTo } from '../router.js';

export function renderNotFoundPage(container) {
  const notFoundContainer = document.createElement('div');
  notFoundContainer.className = 'min-h-screen flex items-center justify-center bg-gray-100';
  
  const content = `
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-4">Oops! Page not found</p>
      <a href="/" class="text-blue-500 hover:text-blue-700 underline">
        Return to Home
      </a>
    </div>
  `;
  
  notFoundContainer.innerHTML = content;
  
  // Add click event for the home link
  const homeLink = notFoundContainer.querySelector('a');
  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/');
  });
  
  // Log the error
  console.error("404 Error: User attempted to access non-existent route:", window.location.pathname);
  
  container.appendChild(notFoundContainer);
}
