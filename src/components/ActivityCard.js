
export function renderActivityCards(container, activities) {
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'px-4 py-3';
  
  let cardsHTML = `
    <div class="mb-3">
      <h2 class="text-lg font-semibold">热门活动</h2>
    </div>
    <div class="grid grid-cols-2 gap-3">
  `;
  
  activities.forEach((activity, index) => {
    cardsHTML += `
      <div 
        class="bg-gradient-to-br from-white to-blue-50/30 rounded-xl overflow-hidden shadow-md hover:shadow-lg card-animate animate-fade-in transform hover:-translate-y-1 transition-all duration-300"
        style="animation-delay: ${index * 0.1}s" 
        data-id="${activity.id}"
      >
        <div class="relative aspect-w-16 aspect-h-9 bg-gray-100 overflow-hidden">
          <img 
            src="${activity.imageUrl}" 
            alt="${activity.title}" 
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div class="absolute bottom-3 left-3 text-white font-medium text-sm">
              查看详情
            </div>
          </div>
        </div>
        
        <div class="p-3">
          <h3 class="font-semibold text-sm leading-tight mb-2">${activity.title}</h3>
          <div class="flex justify-between items-center">
            <div class="text-xs text-gray-500">参与讨论</div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              class="text-gray-400 transition-colors group-hover:text-app-teal" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M7 17L17 7"></path>
              <path d="M7 7h10v10"></path>
            </svg>
          </div>
        </div>
      </div>
    `;
  });
  
  cardsHTML += `</div>`;
  cardsContainer.innerHTML = cardsHTML;
  
  // Add event listeners for activity clicks
  const activityElements = cardsContainer.querySelectorAll('[data-id]');
  activityElements.forEach(element => {
    element.addEventListener('click', () => {
      const id = element.dataset.id;
      console.log('Activity clicked:', id);
      // Implement activity details navigation here
    });
  });
  
  container.appendChild(cardsContainer);
}
