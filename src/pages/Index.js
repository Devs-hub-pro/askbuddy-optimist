
import { renderNavbar } from '../components/Navbar.js';
import { renderSearchBar } from '../components/SearchBar.js';
import { renderCategorySection } from '../components/CategorySection.js';
import { renderActivityCards } from '../components/ActivityCard.js';
import { renderQuestionCards } from '../components/QuestionCard.js';
import { renderBottomNav } from '../components/BottomNav.js';

export function renderHomePage(container) {
  // Create the page structure
  const pageContent = document.createElement('div');
  pageContent.className = 'min-h-screen pb-16';
  
  // Render navbar
  renderNavbar(pageContent, '深圳');
  
  // Render search bar
  renderSearchBar(pageContent, (value) => {
    console.log('Search query:', value);
  });
  
  // Render category section
  renderCategorySection(pageContent);
  
  // Render activity cards
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
  renderActivityCards(pageContent, activities);
  
  // Render question cards
  const questions = [
    {
      id: '1',
      title: '高考填报志愿热门问题',
      description: '面对众多院校和专业选择，如何根据自己的分数、兴趣做出最优选择？分享经验...',
      viewCount: '2.5k',
      asker: {
        name: '李明',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      time: '2小时前',
      tags: ['高考', '志愿填报'],
      points: 50,
      answerName: '张老师',
      answerAvatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
      id: '2',
      title: '留学申请的必备条件',
      description: '想申请美国Top30名校研究生，除了GPA和语言成绩，还需要准备哪些材料？',
      viewCount: '1.8k',
      asker: {
        name: '王芳',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
      },
      time: '5小时前',
      tags: ['留学', '申请'],
      points: 30,
      answerStatus: 'waiting'
    }
  ];
  renderQuestionCards(pageContent, questions, 'topics');
  
  // Render bottom nav
  renderBottomNav(pageContent);
  
  // Append everything to the container
  container.appendChild(pageContent);
}
