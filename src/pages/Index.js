
import { createElement } from '../router.js';
import { renderNavbar } from '../components/Navbar.js';
import { renderSearchBar } from '../components/SearchBar.js';
import { renderCategorySection } from '../components/CategorySection.js';
import { renderBottomNav } from '../components/BottomNav.js';

export function renderHomePage(container) {
  // Current location (default: 深圳)
  const currentLocation = localStorage.getItem('currentLocation') || '深圳';
  
  // Create page elements
  container.className = 'app-container bg-gradient-to-b from-white to-blue-50/30 pb-20';
  
  // Add navbar
  const navbar = renderNavbar(currentLocation);
  container.appendChild(navbar);
  
  // Add search section
  const searchSection = createElement('div', { className: 'px-4 py-6 bg-app-light-bg animate-fade-in' });
  
  const headerContainer = createElement('div', { className: 'flex items-center space-x-2 mb-4' });
  
  const usersIcon = createElement('div', { className: 'text-app-blue' });
  usersIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  
  const title = createElement('h1', { className: 'text-xl font-bold text-gray-800' }, '找人问问');
  const subtitle = createElement('p', { className: 'text-gray-600 text-sm' }, 'AI无法回答的，就找人问问！');
  
  headerContainer.appendChild(usersIcon);
  headerContainer.appendChild(title);
  headerContainer.appendChild(subtitle);
  
  const searchBar = renderSearchBar();
  
  searchSection.appendChild(headerContainer);
  searchSection.appendChild(searchBar);
  container.appendChild(searchSection);
  
  // Add category section
  const categories = renderCategorySection();
  container.appendChild(categories);
  
  // Add activities section
  const activitiesSection = createElement('div', { className: 'px-4 mb-6' });
  
  const activitiesHeader = createElement('div', { className: 'flex items-center gap-2 mb-4' });
  const sparklesIcon = createElement('div', { className: 'text-yellow-500' });
  sparklesIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`;
  
  const activitiesTitle = createElement('h2', { className: 'text-lg font-bold animate-fade-in animate-delay-2' }, '问问热榜');
  
  activitiesHeader.appendChild(sparklesIcon);
  activitiesHeader.appendChild(activitiesTitle);
  
  const activitiesGrid = createElement('div', { className: 'grid grid-cols-2 gap-4' });
  
  // Add activity cards
  const activities = [
    {
      id: '1',
      title: '大学生灵活就业圈',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80'
    },
    {
      id: '2',
      title: '留学申请季交流空间',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=225&q=80'
    }
  ];
  
  activities.forEach((activity, index) => {
    const card = createElement('div', { 
      className: 'bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in card-animate',
      style: `animation-delay: ${0.3 + index * 0.1}s`
    });
    
    const image = createElement('img', { 
      src: activity.imageUrl, 
      alt: activity.title,
      className: 'w-full h-24 object-cover'
    });
    
    const cardContent = createElement('div', { className: 'p-3' });
    const cardTitle = createElement('h3', { className: 'text-sm font-medium' }, activity.title);
    
    cardContent.appendChild(cardTitle);
    card.appendChild(image);
    card.appendChild(cardContent);
    
    activitiesGrid.appendChild(card);
  });
  
  activitiesSection.appendChild(activitiesHeader);
  activitiesSection.appendChild(activitiesGrid);
  container.appendChild(activitiesSection);
  
  // Add questions section
  renderQuestionsSection(container);
  
  // Add bottom navigation
  const bottomNav = renderBottomNav();
  container.appendChild(bottomNav);
  
  return container;
}

function renderQuestionsSection(container) {
  const questionsSection = createElement('div', { className: 'px-4 mb-20' });
  
  // Tabs
  const tabsContainer = createElement('div', { 
    className: 'relative mb-6 after:content-[\'\'] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gray-100' 
  });
  
  const tabsWrapper = createElement('div', { className: 'flex gap-6' });
  
  // Everyone tab (active by default)
  const everyoneTab = createElement('button', { 
    className: 'font-bold text-lg pb-2 relative text-app-text',
    id: 'everyone-tab'
  }, '大家都在问');
  
  const everyoneIndicator = createElement('span', { 
    className: 'absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-teal to-app-blue z-10' 
  });
  everyoneTab.appendChild(everyoneIndicator);
  
  // Experts tab
  const expertsTab = createElement('button', { 
    className: 'font-bold text-lg pb-2 relative text-gray-400',
    id: 'experts-tab'
  }, '找TA问问');
  
  // Add tab switching functionality
  everyoneTab.addEventListener('click', () => switchTab('everyone'));
  expertsTab.addEventListener('click', () => switchTab('experts'));
  
  tabsWrapper.appendChild(everyoneTab);
  tabsWrapper.appendChild(expertsTab);
  tabsContainer.appendChild(tabsWrapper);
  
  // Questions content
  const questionsContent = createElement('div', { className: 'space-y-4', id: 'questions-content' });
  
  // Add mock questions data
  const questions = [
    {
      id: '1',
      title: '高考填报志愿热门问题',
      description: '面对众多院校和专业选择，如何根据自己的分数、兴趣做出最优选择？分享经验...',
      asker: {
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      time: '2小时前',
      tags: ['高考', '志愿填报'],
      points: 50,
      viewCount: '2.5k',
      answerName: '张老师',
      answerAvatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      id: '2',
      title: '留学申请的必备条件',
      description: '想申请美国Top30名校研究生，除了GPA和语言成绩，还需要准备哪些材料？',
      asker: {
        name: '王芳',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      time: '5小时前',
      tags: ['留学', '申请'],
      points: 30,
      viewCount: '1.8k'
    },
    {
      id: '3',
      title: '如何选择最佳职业路径',
      description: '毕业后是进国企还是私企？如何根据自身情况做出规划？',
      asker: {
        name: '张伟',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      time: '1天前',
      tags: ['职业发展', '路径选择'],
      points: 40,
      viewCount: '3.5k'
    }
  ];
  
  // Create question cards
  questions.forEach((question, index) => {
    const card = createElement('div', { 
      className: 'bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in',
      style: `animation-delay: ${0.4 + index * 0.1}s`,
      'data-id': question.id
    });
    
    card.addEventListener('click', () => navigateToQuestion(question.id));
    
    const title = createElement('h3', { className: 'text-base font-medium mb-2' }, question.title);
    const description = createElement('p', { className: 'text-sm text-gray-600 mb-3 line-clamp-2' }, question.description);
    
    const userInfo = createElement('div', { className: 'flex items-center mb-3' });
    
    const avatar = createElement('div', { className: 'w-8 h-8 rounded-full overflow-hidden mr-2' });
    const avatarImg = createElement('img', { 
      src: question.asker.avatar, 
      alt: question.asker.name,
      className: 'w-full h-full object-cover'
    });
    avatar.appendChild(avatarImg);
    
    const userMeta = createElement('div', {});
    const userName = createElement('p', { className: 'text-xs font-medium' }, question.asker.name);
    const timePosted = createElement('p', { className: 'text-xs text-gray-500' }, question.time);
    userMeta.appendChild(userName);
    userMeta.appendChild(timePosted);
    
    userInfo.appendChild(avatar);
    userInfo.appendChild(userMeta);
    
    const cardFooter = createElement('div', { className: 'flex justify-between items-center' });
    
    const tags = createElement('div', { className: 'flex space-x-2' });
    question.tags.forEach(tag => {
      const tagEl = createElement('span', { 
        className: 'bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full' 
      }, `#${tag}`);
      tags.appendChild(tagEl);
    });
    
    const pointsBadge = createElement('div', { 
      className: 'bg-orange-100 text-orange-500 text-xs px-3 py-1 rounded-full font-medium flex items-center' 
    });
    
    const pointsIcon = createElement('span', { className: 'mr-1' });
    pointsIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6v12m-8-6h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    
    const pointsText = document.createTextNode(`${question.points}积分`);
    pointsBadge.appendChild(pointsIcon);
    pointsBadge.appendChild(pointsText);
    
    cardFooter.appendChild(tags);
    cardFooter.appendChild(pointsBadge);
    
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(userInfo);
    card.appendChild(cardFooter);
    
    questionsContent.appendChild(card);
  });
  
  questionsSection.appendChild(tabsContainer);
  questionsSection.appendChild(questionsContent);
  container.appendChild(questionsSection);
  
  // Define tab switching function in global scope
  window.switchTab = function(tabName) {
    const everyoneTab = document.getElementById('everyone-tab');
    const expertsTab = document.getElementById('experts-tab');
    const questionsContent = document.getElementById('questions-content');
    
    if (tabName === 'everyone') {
      everyoneTab.className = 'font-bold text-lg pb-2 relative text-app-text';
      expertsTab.className = 'font-bold text-lg pb-2 relative text-gray-400';
      
      // Add indicator to active tab
      if (!everyoneTab.querySelector('span')) {
        const indicator = createElement('span', { 
          className: 'absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-teal to-app-blue z-10' 
        });
        everyoneTab.appendChild(indicator);
      }
      
      // Remove indicator from inactive tab
      const expertsIndicator = expertsTab.querySelector('span');
      if (expertsIndicator) {
        expertsTab.removeChild(expertsIndicator);
      }
      
      // Show questions content
      renderQuestionsContent(questionsContent);
    } else {
      everyoneTab.className = 'font-bold text-lg pb-2 relative text-gray-400';
      expertsTab.className = 'font-bold text-lg pb-2 relative text-app-text';
      
      // Add indicator to active tab
      if (!expertsTab.querySelector('span')) {
        const indicator = createElement('span', { 
          className: 'absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-app-teal to-app-blue z-10' 
        });
        expertsTab.appendChild(indicator);
      }
      
      // Remove indicator from inactive tab
      const everyoneIndicator = everyoneTab.querySelector('span');
      if (everyoneIndicator) {
        everyoneTab.removeChild(everyoneIndicator);
      }
      
      // Show experts content
      renderExpertsContent(questionsContent);
    }
  };
}

function renderQuestionsContent(container) {
  // Clear container
  container.innerHTML = '';
  
  // Add mock questions data
  const questions = [
    {
      id: '1',
      title: '高考填报志愿热门问题',
      description: '面对众多院校和专业选择，如何根据自己的分数、兴趣做出最优选择？分享经验...',
      asker: {
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      time: '2小时前',
      tags: ['高考', '志愿填报'],
      points: 50,
      viewCount: '2.5k',
      answerName: '张老师',
      answerAvatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      id: '2',
      title: '留学申请的必备条件',
      description: '想申请美国Top30名校研究生，除了GPA和语言成绩，还需要准备哪些材料？',
      asker: {
        name: '王芳',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      time: '5小时前',
      tags: ['留学', '申请'],
      points: 30,
      viewCount: '1.8k'
    },
    {
      id: '3',
      title: '如何选择最佳职业路径',
      description: '毕业后是进国企还是私企？如何根据自身情况做出规划？',
      asker: {
        name: '张伟',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      time: '1天前',
      tags: ['职业发展', '路径选择'],
      points: 40,
      viewCount: '3.5k'
    }
  ];
  
  // Create question cards
  questions.forEach((question, index) => {
    const card = createElement('div', { 
      className: 'bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in',
      style: `animation-delay: ${0.4 + index * 0.1}s`,
      'data-id': question.id
    });
    
    card.addEventListener('click', () => navigateToQuestion(question.id));
    
    const title = createElement('h3', { className: 'text-base font-medium mb-2' }, question.title);
    const description = createElement('p', { className: 'text-sm text-gray-600 mb-3 line-clamp-2' }, question.description);
    
    const userInfo = createElement('div', { className: 'flex items-center mb-3' });
    
    const avatar = createElement('div', { className: 'w-8 h-8 rounded-full overflow-hidden mr-2' });
    const avatarImg = createElement('img', { 
      src: question.asker.avatar, 
      alt: question.asker.name,
      className: 'w-full h-full object-cover'
    });
    avatar.appendChild(avatarImg);
    
    const userMeta = createElement('div', {});
    const userName = createElement('p', { className: 'text-xs font-medium' }, question.asker.name);
    const timePosted = createElement('p', { className: 'text-xs text-gray-500' }, question.time);
    userMeta.appendChild(userName);
    userMeta.appendChild(timePosted);
    
    userInfo.appendChild(avatar);
    userInfo.appendChild(userMeta);
    
    const cardFooter = createElement('div', { className: 'flex justify-between items-center' });
    
    const tags = createElement('div', { className: 'flex space-x-2' });
    question.tags.forEach(tag => {
      const tagEl = createElement('span', { 
        className: 'bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full' 
      }, `#${tag}`);
      tags.appendChild(tagEl);
    });
    
    const pointsBadge = createElement('div', { 
      className: 'bg-orange-100 text-orange-500 text-xs px-3 py-1 rounded-full font-medium flex items-center' 
    });
    
    const pointsIcon = createElement('span', { className: 'mr-1' });
    pointsIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6v12m-8-6h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    
    const pointsText = document.createTextNode(`${question.points}积分`);
    pointsBadge.appendChild(pointsIcon);
    pointsBadge.appendChild(pointsText);
    
    cardFooter.appendChild(tags);
    cardFooter.appendChild(pointsBadge);
    
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(userInfo);
    card.appendChild(cardFooter);
    
    container.appendChild(card);
  });
}

function renderExpertsContent(container) {
  // Clear container
  container.innerHTML = '';
  
  // Add mock experts data
  const experts = [
    {
      id: '1',
      name: '张同学',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: '北大硕士 | 出国党',
      description: '专注留学申请文书指导，斯坦福offer获得者。我有多年指导经验，曾帮助超过50名学生申请到世界顶尖大学。',
      tags: ['留学', '文书', '面试'],
      rating: 4.9,
      responseRate: '98%',
      orderCount: '126单'
    },
    {
      id: '2',
      name: '刘导师',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      title: '清华博士 | 考研规划',
      description: '5年考研辅导经验，擅长数学与专业课。我曾帮助上百名考生成功上岸，针对考研数学和计算机专业课有独到的教学和复习方法。',
      tags: ['考研', '数学', '规划'],
      rating: 4.8,
      responseRate: '95%',
      orderCount: '210单'
    },
    {
      id: '3',
      name: '王老师',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: '高考志愿规划师',
      description: '10年高考志愿填报指导经验，专精各省份政策。我深入研究过全国各省份的高考政策和各大高校的招生情况。',
      tags: ['高考', '志愿填报', '专业选择'],
      rating: 4.7,
      responseRate: '92%',
      orderCount: '185单'
    }
  ];
  
  // Create expert cards
  experts.forEach((expert, index) => {
    const card = createElement('div', { 
      className: 'bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer',
      'data-id': expert.id
    });
    
    card.addEventListener('click', () => navigateToExpertProfile(expert.id));
    
    const cardHeader = createElement('div', { className: 'flex justify-between items-start' });
    
    const expertInfo = createElement('div', { className: 'flex items-center gap-2' });
    
    const avatar = createElement('div', { className: 'w-10 h-10 rounded-full overflow-hidden border border-green-50' });
    const avatarImg = createElement('img', { 
      src: expert.avatar, 
      alt: expert.name,
      className: 'w-full h-full object-cover'
    });
    avatar.appendChild(avatarImg);
    
    const basicInfo = createElement('div', {});
    const name = createElement('h3', { className: 'text-sm font-semibold text-gray-800' }, expert.name);
    const title = createElement('p', { className: 'text-xs text-green-600' }, expert.title);
    basicInfo.appendChild(name);
    basicInfo.appendChild(title);
    
    expertInfo.appendChild(avatar);
    expertInfo.appendChild(basicInfo);
    
    const stats = createElement('div', { className: 'flex flex-col items-end' });
    
    const rating = createElement('div', { className: 'flex items-center text-yellow-500 gap-1' });
    rating.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>`;
    const ratingText = createElement('span', { className: 'text-xs font-medium' }, expert.rating.toString());
    rating.appendChild(ratingText);
    
    const response = createElement('div', { className: 'flex items-center text-blue-500 gap-1 text-xs' });
    response.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    const responseText = createElement('span', {}, expert.responseRate);
    response.appendChild(responseText);
    
    const orders = createElement('div', { className: 'flex items-center text-green-500 gap-1 text-xs' });
    orders.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="8" x2="8" y2="8"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="16" y1="16" x2="8" y2="16"/></svg>`;
    const ordersText = createElement('span', {}, expert.orderCount);
    orders.appendChild(ordersText);
    
    stats.appendChild(rating);
    stats.appendChild(response);
    stats.appendChild(orders);
    
    cardHeader.appendChild(expertInfo);
    cardHeader.appendChild(stats);
    
    const description = createElement('div', { className: 'flex mt-2' });
    const descText = createElement('p', { 
      className: 'text-xs text-gray-700 border-l-2 border-green-200 pl-2 py-0.5 bg-green-50/50 rounded-r-md flex-1 mr-2 line-clamp-2' 
    }, expert.description);
    
    const askButton = createElement('button', { 
      className: 'bg-gradient-to-r from-green-500 to-teal-400 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 h-auto',
      onClick: (e) => {
        e.stopPropagation();
        // Add ask functionality here
      }
    });
    
    askButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    const buttonText = document.createTextNode('找我问问');
    askButton.appendChild(buttonText);
    
    description.appendChild(descText);
    description.appendChild(askButton);
    
    const tags = createElement('div', { className: 'flex flex-wrap gap-1.5 mt-2' });
    expert.tags.forEach(tag => {
      const tagEl = createElement('span', { 
        className: 'bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full' 
      }, `#${tag}`);
      tags.appendChild(tagEl);
    });
    
    card.appendChild(cardHeader);
    card.appendChild(description);
    card.appendChild(tags);
    
    container.appendChild(card);
  });
}

// Navigation helpers
function navigateToQuestion(id) {
  window.history.pushState({}, '', `/question/${id}`);
  // Update UI to show question details
  document.dispatchEvent(new Event('popstate'));
}

function navigateToExpertProfile(id) {
  window.history.pushState({}, '', `/expert-profile/${id}`);
  // Update UI to show expert profile
  document.dispatchEvent(new Event('popstate'));
}
