
import { navigateTo } from '../router.js';

export function renderQuestionCards(container, questions, activeTab = 'topics') {
  const questionsSection = document.createElement('div');
  questionsSection.className = 'px-4 py-4';
  
  let questionsHTML = `
    <div class="mb-4">
      <div class="flex border-b border-gray-200">
        <button 
          class="text-sm px-4 py-2 font-medium ${activeTab === 'topics' ? 'text-app-teal border-b-2 border-app-teal' : 'text-gray-500'}"
          data-tab="topics"
        >
          热门问题
        </button>
        <button 
          class="text-sm px-4 py-2 font-medium ${activeTab === 'experts' ? 'text-app-teal border-b-2 border-app-teal' : 'text-gray-500'}"
          data-tab="experts"
        >
          热门达人
        </button>
      </div>
    </div>
    <div class="space-y-4">
  `;
  
  questions.forEach((question, index) => {
    questionsHTML += `
      <div 
        class="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in border border-gray-100 cursor-pointer"
        style="animation-delay: ${index * 0.1}s"
        data-id="${question.id}"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-base text-left text-gray-800">${question.title}</h3>
          ${question.viewCount ? `
            <div class="flex items-center gap-1 text-gray-500 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${question.viewCount}</span>
            </div>
          ` : ''}
        </div>
        
        ${question.description ? `
          <p class="text-sm text-gray-600 mb-3 text-left line-clamp-2">${question.description}</p>
        ` : ''}
        
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 cursor-pointer">
            <div class="w-8 h-8 rounded-full border border-gray-100 overflow-hidden">
              <img src="${question.asker.avatar}" alt="${question.asker.name}" class="w-full h-full object-cover" />
            </div>
            <div class="text-left">
              <div class="text-xs font-medium text-gray-700">${question.asker.name}</div>
              <div class="text-xs text-gray-500">${question.time}</div>
            </div>
          </div>
          
          <span class="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 text-amber-600 text-xs px-2.5 py-1 rounded-full font-medium border border-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500">
              <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2l3 6.3 7 1-5 4.8 1.2 6.9-6.2-3.2Z"></path>
            </svg>
            ${question.points} 积分
          </span>
        </div>
        
        <div class="flex justify-between items-center">
          <div class="flex flex-wrap gap-1.5">
            ${question.tags.map(tag => `
              <span class="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
                #${tag}
              </span>
            `).join('')}
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              class="bg-gradient-to-r from-blue-500 to-app-blue text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              data-question-id="${question.id}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              回答
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  questionsHTML += `</div>`;
  questionsSection.innerHTML = questionsHTML;
  
  // Add event listeners
  // Tab switching
  const tabButtons = questionsSection.querySelectorAll('[data-tab]');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;
      // In a real app, you'd fetch new data here
      renderQuestionCards(container, questions, tab);
    });
  });
  
  // Question clicks
  const questionElements = questionsSection.querySelectorAll('[data-id]');
  questionElements.forEach(element => {
    element.addEventListener('click', () => {
      const id = element.dataset.id;
      navigateTo(`/question/${id}`);
    });
  });
  
  // Answer button clicks
  const answerButtons = questionsSection.querySelectorAll('[data-question-id]');
  answerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const questionId = button.dataset.questionId;
      navigateTo(`/question/${questionId}`);
    });
  });
  
  container.appendChild(questionsSection);
}
