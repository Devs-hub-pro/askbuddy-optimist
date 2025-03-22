
/**
 * List of icons used in the application
 * This file serves as documentation for all icons needed for the WeChat mini-program version
 */

// Icons used in the Navbar component
export const navbarIcons = [
  { name: 'map-pin', description: 'Location pin icon for city selection' },
  { name: 'chevron-down', description: 'Dropdown arrow for location selector' },
  { name: 'bell', description: 'Notification bell icon' },
  { name: 'calendar', description: 'Calendar icon for schedules and events' }
];

// Icons used in the SearchBar component
export const searchBarIcons = [
  { name: 'search', description: 'Search icon for search input' },
  { name: 'users', description: 'Users icon for the app title section' },
  { name: 'sparkles', description: 'Sparkles icon for the tagline' }
];

// Icons used in the CategorySection component
export const categorySectionIcons = [
  { name: 'graduation-cap', description: 'Education category icon' },
  { name: 'briefcase', description: 'Career development category icon' },
  { name: 'home', description: 'Lifestyle services category icon' },
  { name: 'camera', description: 'Hobbies and skills category icon' }
];

// Icons used in the ActivityCard component
export const activityCardIcons = [
  { name: 'arrow-up-right', description: 'Arrow icon for activity card' },
  { name: 'calendar', description: 'Calendar icon for events' },
  { name: 'clock', description: 'Clock icon for time' }
];

// Icons used in the QuestionCard component
export const questionCardIcons = [
  { name: 'message-circle', description: 'Message icon for answer button' },
  { name: 'award', description: 'Award icon for points' },
  { name: 'heart', description: 'Heart icon for favorites' }
];

// Icons used in the BottomNav component
export const bottomNavIcons = [
  { name: 'home', description: 'Home tab icon' },
  { name: 'compass', description: 'Discover tab icon' },
  { name: 'plus', description: 'New question tab icon' },
  { name: 'message-square', description: 'Messages tab icon' },
  { name: 'user', description: 'Profile tab icon' }
];

// Icons used in dialogs and modals
export const dialogIcons = [
  { name: 'x', description: 'Close icon for dialogs and modals' },
  { name: 'check', description: 'Check icon for confirmations' },
  { name: 'alert-circle', description: 'Alert icon for warnings' },
  { name: 'info', description: 'Info icon for information' }
];

// Icons used in interactions
export const interactionIcons = [
  { name: 'thumbs-up', description: 'Like icon' },
  { name: 'thumbs-down', description: 'Dislike icon' },
  { name: 'share', description: 'Share icon' },
  { name: 'comment', description: 'Comment icon' },
  { name: 'edit', description: 'Edit icon' },
  { name: 'trash', description: 'Delete icon' }
];

// Navigation icons
export const navigationIcons = [
  { name: 'arrow-left', description: 'Back icon' },
  { name: 'arrow-right', description: 'Forward icon' },
  { name: 'check-circle', description: 'Selected item icon' },
  { name: 'circle', description: 'Unselected item icon' }
];

// Utility icons
export const utilityIcons = [
  { name: 'download', description: 'Download icon' },
  { name: 'copy', description: 'Copy icon' },
  { name: 'settings', description: 'Settings icon' },
  { name: 'sun', description: 'Points or rewards icon' },
  { name: 'close', description: 'Close button icon' }
];

// All icons used in the application
export const allIcons = [
  ...navbarIcons,
  ...searchBarIcons,
  ...categorySectionIcons,
  ...activityCardIcons,
  ...questionCardIcons,
  ...bottomNavIcons,
  ...dialogIcons,
  ...interactionIcons,
  ...navigationIcons,
  ...utilityIcons
];

/**
 * For WeChat Mini Program:
 * 
 * These icons should be saved as PNG files in the following structure:
 * /assets/icons/[icon-name].png
 * /assets/icons/[icon-name]-active.png (for tab bar active states)
 * 
 * Example:
 * /assets/icons/home.png
 * /assets/icons/home-active.png
 * /assets/icons/map-pin.png
 * /assets/icons/search.png
 * etc.
 */

