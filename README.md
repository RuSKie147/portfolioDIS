# Raj's Digital Portfolio

An interactive portfolio showcasing my work in Visual Design, Development, Video Editing, and Design Thinking.

## 🚀 Features

- **Responsive Design:** Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode:** Toggle between dark and light modes
- **Interactive Elements:**
  - Animated project cards with 3D tilt effects
  - Interactive chatbot avatar with contextual guidance
  - Draggable neon elements
  - Testimonial slider with swipe gestures
- **Dynamic Background:** Circuit pattern overlay that adapts to theme changes
- **Scroll-Based Animations:** Elements reveal as you scroll through the site
- **Project Showcases:** Detailed project pages with embedded content

## 💻 Tech Stack

### Frontend
- **HTML5/CSS3:** Semantic markup and custom styling
- **JavaScript:** Vanilla JS for interactive elements and animations
- **Tailwind CSS:** Utility-first CSS framework for responsive design
- **anime.js:** JavaScript animation library for smooth transitions
- **Google Drive Embedding:** For video project display

### Performance Optimizations
- Lazy loading for images and iframes
- CSS animation optimization with `will-change` properties
- Debounced event handlers for scroll and resize events

### UI/UX Features
- Intersection Observer API for scroll-based animations
- Custom cursor effects and hover states
- Adaptive color schemes based on theme preference


## 🔧 Core Components

### Avatar Chatbot
An interactive assistant that provides contextual guidance based on:
- Current section being viewed
- User interactions with project cards
- Time-based idle sequences
- Scroll position awareness

### Project Cards
- 3D tilt effect on hover using perspective transforms
- Flip animation to reveal additional details
- Optimized for touch devices with fallback interactions

### Theme Switcher
- Toggles between dark (cyberpunk blue/purple) and light (cyberpunk pink) themes
- Persists user preference in localStorage
- Dynamically adjusts all UI elements including glows and shadows

### Navigation
- Smooth scrolling section navigation
- Active state tracking with IntersectionObserver
- Mobile-optimized bottom navigation bar

## 🚀 Deployment

To deploy this portfolio:

1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
   - Select `main` branch as source
   - Set publishing directory to `/` (root)
3. Access your live site at `https://[username].github.io/portfolioDIS/`

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: ≥ 1024px
