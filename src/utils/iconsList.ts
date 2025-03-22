
/**
 * List of icons used in the application
 * This file serves as documentation for all icons needed for the WeChat mini-program version
 */

// Icons used in the Navbar component
export const navbarIcons = [
  { name: 'map-pin', description: 'Location pin icon for city selection' },
  { name: 'chevron-down', description: 'Dropdown arrow for location selector' },
  { name: 'bell', description: 'Notification bell icon' }
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
  { name: 'arrow-up-right', description: 'Arrow icon for activity card' }
];

// Icons used in the QuestionCard component
export const questionCardIcons = [
  { name: 'message-circle', description: 'Message icon for answer button' },
  { name: 'award', description: 'Award icon for points' }
];

// Icons used in the BottomNav component
export const bottomNavIcons = [
  { name: 'home', description: 'Home tab icon' },
  { name: 'compass', description: 'Discover tab icon' },
  { name: 'plus', description: 'New question tab icon' },
  { name: 'message-square', description: 'Messages tab icon' },
  { name: 'user', description: 'Profile tab icon' }
];

// All icons used in the application
export const allIcons = [
  ...navbarIcons,
  ...searchBarIcons,
  ...categorySectionIcons,
  ...activityCardIcons,
  ...questionCardIcons,
  ...bottomNavIcons
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
