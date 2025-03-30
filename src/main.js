
// Remove React imports and initialize the app with vanilla JavaScript
import './index.css';
import { initRouter } from './router.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize router to handle navigation
  initRouter();
});
