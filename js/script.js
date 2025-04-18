const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Add this check:
if (!themeToggle) {
    console.error("Theme toggle button not found!");
} else {
    console.log("Theme toggle button found.");
}

// Function to apply the theme
const applyTheme = (theme) => {
    console.log(`Applying theme: ${theme}`);
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
        // Add back body class toggling
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
    } else {
        htmlElement.classList.remove('dark');
        // Add back body class toggling
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
    }
};

// Check localStorage for saved theme preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Determine initial theme
let currentTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
console.log(`Initial theme determined: ${currentTheme}`); // Add logging
applyTheme(currentTheme);

// Add event listener to the toggle button
if (themeToggle) { // Check if button exists before adding listener
    themeToggle.addEventListener('click', () => {
        console.log("Theme toggle button clicked!"); // Add logging
        currentTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme); // Save preference
    });
}

// Optional: Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) { // Only if user hasn't manually set a theme
        currentTheme = e.matches ? 'dark' : 'light';
        applyTheme(currentTheme);
    }
});

// --- Active Nav Link Logic ---
const sections = document.querySelectorAll('section[id]'); // Get all sections with an ID
const navLinks = document.querySelectorAll('#bottom-nav a'); // Get nav links

const observerOptions = {
  root: null, // relative to document viewport
  rootMargin: '0px',
  threshold: 0.5 // Trigger when 50% of the section is visible
};

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    const navLink = document.querySelector(`#bottom-nav a[href="#${entry.target.id}"]`);
    if (entry.isIntersecting) {
      // Remove active class from all links
      navLinks.forEach(link => link.classList.remove('active'));
      // Add active class to the current link
      if (navLink) {
        navLink.classList.add('active');
      }
    } else {
      // Optional: Remove active class if section goes out of view
      // if (navLink) {
      //   navLink.classList.remove('active');
      // }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe each section
sections.forEach(section => {
  observer.observe(section);
});

// Set initial active link based on page load (optional, might default to home)
// You could refine this to check hash on load if needed
const initialLink = document.querySelector('#nav-home');
if (initialLink) {
    // initialLink.classList.add('active'); // Uncomment to default home to active
}

// --- Scroll Animations (Task 4) ---

// Function to apply theme-based glow classes and temporary glitch
const applyGlowClasses = (theme) => {
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach(h => {
        h.classList.remove('neon-glow-blue', 'neon-glow-magenta'); // Remove existing glows
        if (theme === 'light') {
            h.classList.add('neon-glow-blue');
        } else {
            h.classList.add('neon-glow-magenta');
        }
    });
};

// Apply initial glow based on current theme
applyGlowClasses(currentTheme);

// Re-apply glow classes when theme changes
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        applyGlowClasses(newTheme);
    });
}

// --- Intersection Observers for Animations ---

// Observer for general section fade-in/slide-up
const sectionObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const sectionAnimationCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      anime({
        targets: entry.target,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600, // Slightly faster
        easing: 'cubicBezier(0.6, 0, 0.4, 1)', // Sharper easing
        delay: anime.stagger(80, { start: 50 })
      });
      observer.unobserve(entry.target);
    }
  });
};

const sectionObserver = new IntersectionObserver(sectionAnimationCallback, sectionObserverOptions);

document.querySelectorAll('section:not(#home):not(#story), .project-card-link').forEach(el => {
  el.style.opacity = 0;
  sectionObserver.observe(el);
});

// Observer for Story Section Content Animation
const storyContent = document.querySelector('#story .prose');
if (storyContent) {
    storyContent.style.opacity = 0;
    const storyObserverOptions = { threshold: 0.25 };
    const storyObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const paragraphs = entry.target.querySelectorAll('p');
                paragraphs.forEach(p => p.style.opacity = 0);

                anime.timeline({
                    targets: paragraphs,
                    easing: 'cubicBezier(0.6, 0, 0.4, 1)', // Sharper easing
                    delay: anime.stagger(150, {start: 100}), // Slightly faster stagger
                    begin: () => { storyContent.style.opacity = 1; }
                })
                .add({
                    opacity: [0, 1],
                    translateY: [15, 0],
                    skewX: [-2, 0], // Reduced skew
                    duration: 500 // Faster duration
                });

                observer.unobserve(entry.target);
            }
        });
    };
    const storyObserver = new IntersectionObserver(storyObserverCallback, storyObserverOptions);
    storyObserver.observe(storyContent);
}

// Observer for Hero Text Scramble Animation
const heroHeading = document.querySelector('#home h1');
if (heroHeading) {
    heroHeading.style.opacity = 0;
    const heroObserverOptions = { threshold: 0.3 };
    const heroObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalText = target.textContent;
                target.textContent = '';
                target.style.opacity = 1;

                // Add glitch effect briefly during scramble
                target.classList.add('glitch-effect');
                // Set random CSS variables for glitch animation
                target.style.setProperty('--glitch-rand-x', Math.random());
                target.style.setProperty('--glitch-rand-y', Math.random());
                const glitchInterval = setInterval(() => {
                    target.style.setProperty('--glitch-rand-x', Math.random());
                    target.style.setProperty('--glitch-rand-y', Math.random());
                }, 50);

                let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>?/';
                let durationPerChar = 40; // Faster scramble
                let totalDuration = originalText.length * durationPerChar;
                let startTime = Date.now();

                let scrambleIntervalId = setInterval(() => {
                    let elapsed = Date.now() - startTime;
                    target.textContent = Array.from(originalText)
                        .map((char, index) => {
                            if (index * durationPerChar > elapsed) {
                                return chars[Math.floor(Math.random() * chars.length)];
                            }
                            return char;
                        })
                        .join('');
                    if (elapsed >= totalDuration) {
                         clearInterval(scrambleIntervalId);
                         clearInterval(glitchInterval);
                         target.textContent = originalText;
                         target.classList.remove('glitch-effect'); // Remove glitch after scramble
                    }
                }, 25);

                observer.unobserve(target);
            }
        });
    };
    const heroObserver = new IntersectionObserver(heroObserverCallback, heroObserverOptions);
    heroObserver.observe(heroHeading);
}

// Observer for Bottom Nav Animation
const bottomNav = document.getElementById('bottom-nav');
if (bottomNav) {
    bottomNav.style.opacity = 0;
    bottomNav.style.transform = 'translateY(100%)';
    const navObserverOptions = { threshold: 0.1 };
    const navObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.boundingClientRect.top < window.innerHeight * 0.9) {
                 anime({
                    targets: bottomNav,
                    opacity: [0, 1],
                    translateY: ['100%', '0%'],
                    duration: 500, // Faster
                    easing: 'cubicBezier(0.6, 0, 0.4, 1)' // Sharper easing
                });
                observer.unobserve(entry.target);
            }
        });
    };
    const navObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);
    const homeSection = document.getElementById('home');
    if (homeSection) {
        navObserver.observe(homeSection);
    }
}

// --- Project Card Flip (Task 5 - Implementation) ---
document.querySelectorAll('.project-card-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent immediate navigation
        const card = link.querySelector('.project-card');
        console.log('Card clicked, flip animation placeholder');

        anime.timeline({
            targets: card,
            rotateY: { value: '+=180', delay: 0 }, // Simple flip
            duration: 600,
            easing: 'cubicBezier(0.6, 0, 0.4, 1)', // Sharper easing for flip
            complete: () => {
                console.log('Flip complete, redirecting...');
                // window.location.href = link.href; // Redirect after animation
            }
        });

        // Add delay before potential redirect (adjust as needed)
        // setTimeout(() => {
        //     // window.location.href = link.href; // Redirect here if not using complete callback
        // }, 800); // Delay should be longer than animation
    });
});

// --- Improved Interactive 3D Tilt for Project Cards (Natural, Subtle, Shadow Follows) ---
document.querySelectorAll('.project-card-tilt').forEach(wrapper => {
    const card = wrapper.querySelector('.project-card');
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let animating = false;
    let rafId;

    const maxRotateY = 10; // Subtle
    const maxRotateX = 5;  // Subtle
    const spring = 0.15;

    function animate() {
        mouseX += (targetX - mouseX) * spring;
        mouseY += (targetY - mouseY) * spring;
        card.style.transform = `rotateY(${mouseX}deg) rotateX(${mouseY}deg) scale(1.04)`;
        // Shadow follows tilt
        const shadowX = -mouseX * 2;
        const shadowY = mouseY * 2 + 10;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 40px 0 rgba(0, 255, 255, 0.18), 0 0 32px 8px rgba(255,0,255,0.10), 0 2px 24px 0 rgba(0,0,0,0.13)`;
        if (Math.abs(mouseX - targetX) > 0.1 || Math.abs(mouseY - targetY) > 0.1) {
            rafId = requestAnimationFrame(animate);
        } else {
            mouseX = targetX;
            mouseY = targetY;
            card.style.transform = `rotateY(${mouseX}deg) rotateX(${mouseY}deg) scale(1.04)`;
            card.style.boxShadow = `${-mouseX * 2}px ${mouseY * 2 + 10}px 40px 0 rgba(0, 255, 255, 0.18), 0 0 32px 8px rgba(255,0,255,0.10), 0 2px 24px 0 rgba(0,0,0,0.13)`;
            animating = false;
        }
    }

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        targetX = ((x - centerX) / centerX) * maxRotateY;
        targetY = -((y - centerY) / centerY) * maxRotateX;
        if (!animating) {
            animating = true;
            animate();
        }
    });
    wrapper.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        if (!animating) {
            animating = true;
            animate();
        }
    });
    wrapper.addEventListener('mouseenter', () => {
        card.style.transition = 'box-shadow 0.3s cubic-bezier(0.22,1,0.36,1)';
    });
});

// --- UI Sound Effects (Task 8 - Basic Setup) ---
// Use Web Audio API to create sounds programmatically instead of loading files
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Sound effect generator functions
const createHoverSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    // Lower frequency range for a more subtle sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.05);
    
    // Reduce volume significantly
    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.005, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    // Shorter duration for less intrusive sound
    oscillator.stop(audioContext.currentTime + 0.1);
};

const createClickSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
};

// Initialize sound effects
let soundEnabled = true;
console.log('Web Audio sound effects initialized');

// Add hover sounds to links and buttons
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (soundEnabled) {
            createHoverSound();
        }
    });
});

// Add click sounds to links and buttons
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
        if (soundEnabled) {
            createClickSound();
        }
    });
});

// --- Interactive Cursor Trail (Task 3) ---
const backgroundOverlay = document.getElementById('background-overlay');
let lastMouseX = 0;
let lastMouseY = 0;
let throttleTimeout;
const throttleDelay = 20; // Increased throttle delay for reduced particle frequency

console.log("Cursor trail script loaded");
console.log("Background overlay found:", !!backgroundOverlay);

const createParticle = (x, y) => {
    if (!backgroundOverlay) return;
    
    // Only log occasionally to avoid console spam
    if (Math.random() < 0.01) {
        console.log("Creating particle at", x, y);
    }

    // Create fewer particles (reduced from 3 to 1-2)
    const particleCount = Math.random() > 0.5 ? 1 : 2;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('cursor-particle');

        // Set initial position centered on cursor with slight variation
        const offsetX = i === 0 ? 0 : (Math.random() * 8 - 4);
        const offsetY = i === 0 ? 0 : (Math.random() * 8 - 4);
        
        particle.style.left = `${x - 2.5 + offsetX}px`; // Offset by half width (5px/2)
        particle.style.top = `${y - 2.5 + offsetY}px`;  // Offset by half height (5px/2)

        // Set color based on theme with varying intensity for each particle
        const isDark = htmlElement.classList.contains('dark');
        // Use existing theme colors: Cyan for dark, Pink for light
        const hue = isDark ? 'hsl(180, 100%, ' : 'hsl(330, 100%, ';
        const brightness = isDark ? (60 + i * 10) : (50 + i * 10);
        const particleColor = `${hue}${brightness}%)`;
        
        particle.style.backgroundColor = particleColor;
        particle.style.color = particleColor; // For box-shadow glow

        backgroundOverlay.appendChild(particle);

        // Animate with Anime.js
        anime({
            targets: particle,
            translateX: anime.random(-40, 40), // Reduced range
            translateY: anime.random(-40, 40), // Reduced range
            scale: [1, 0], // Scale down to nothing
            opacity: [0.8, 0],
            duration: anime.random(600, 1200), // Slightly shorter duration
            easing: 'cubicBezier(0.6, 0, 0.4, 1)',
            complete: () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        });
    }
};

const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Create particles even with small movements for better visibility
    createParticle(x, y);

    lastMouseX = x;
    lastMouseY = y;
};

// Throttled mousemove listener
document.addEventListener('mousemove', (e) => {
    if (!throttleTimeout) {
        handleMouseMove(e);
        throttleTimeout = setTimeout(() => {
            throttleTimeout = null;
        }, throttleDelay);
    }
});

// --- Circuit Pattern Background Effect ---
// Create circuit patterns in the background
const createCircuitPattern = () => {
    if (!backgroundOverlay) return;

    // Clear existing circuit nodes
    const existingNodes = backgroundOverlay.querySelectorAll('.circuit-node, .circuit-line');
    existingNodes.forEach(node => node.remove());

    // Get window dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Determine number of nodes based on screen size
    const nodeCount = Math.floor((width * height) / 20000); // Adjust for density
    
    // Create nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.classList.add('circuit-node');
        
        // Position nodes randomly
        const x = Math.random() * width;
        const y = Math.random() * height;
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        
        // Set color based on theme
        const isDark = htmlElement.classList.contains('dark');
        const nodeColor = isDark ? '#00e5e5' : '#ff007f';
        node.style.backgroundColor = nodeColor;
        
        backgroundOverlay.appendChild(node);
        nodes.push({ element: node, x, y });
    }
    
    // Connect some nodes with lines
    for (let i = 0; i < nodes.length; i++) {
        // Connect to 1-3 nearby nodes
        for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
            // Find a nearby node
            let nearbyIndex = Math.floor(Math.random() * nodes.length);
            
            // Skip if it's the same node or too far away
            if (nearbyIndex === i) continue;
            
            const node1 = nodes[i];
            const node2 = nodes[nearbyIndex];
            
            // Calculate distance
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only connect if reasonably close
            if (distance < 300) {
                const line = document.createElement('div');
                line.classList.add('circuit-line');
                
                // Position and size the line
                line.style.left = `${node1.x}px`;
                line.style.top = `${node1.y}px`;
                line.style.width = `${distance}px`;
                
                // Calculate rotation angle
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                line.style.transform = `rotate(${angle}deg)`;
                
                // Set color based on theme
                const isDark = htmlElement.classList.contains('dark');
                const lineColor = isDark ? 
                    `rgba(0, 229, 229, ${0.1 + Math.random() * 0.2})` : 
                    `rgba(255, 0, 127, ${0.1 + Math.random() * 0.2})`;
                line.style.backgroundColor = lineColor;
                
                backgroundOverlay.appendChild(line);
            }
        }
    }
};

// Create initial circuit pattern
createCircuitPattern();

// Recreate on window resize
window.addEventListener('resize', () => {
    // Debounce resize event
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        createCircuitPattern();
    }, 200);
});

// Recreate when theme changes
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Small delay to allow theme to change first
        setTimeout(createCircuitPattern, 50);
    });
}

// --- Neon Border Reveal Animation (Cleaner & Slower) ---
(function() {
    const cardLinks = document.querySelectorAll('.project-card-link');
    cardLinks.forEach(link => link.style.opacity = 0);

    const BORDER_ANIM_DURATION = 1500; // ms (slower for a cleaner effect)

    const revealCards = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target.querySelector('.project-card');
                const rect = card.getBoundingClientRect();

                entry.target.style.opacity = 1;
                card.style.opacity = 0;
                card.classList.add('revealing');

                // Create SVG neon border
                const neonBorder = document.createElement('div');
                neonBorder.className = 'neon-border-anim';
                const w = rect.width;
                const h = rect.height;
                const r = 20; // border-radius
                neonBorder.innerHTML = `
                  <svg width="${w}" height="${h}">
                    <rect
                      class="neon-border-path"
                      x="2" y="2"
                      width="${w-4}" height="${h-4}"
                      rx="${r-2}" ry="${r-2}"
                    />
                  </svg>
                `;
                card.appendChild(neonBorder);

                // Animate the border using stroke-dasharray/offset
                const path = neonBorder.querySelector('.neon-border-path');
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.getBoundingClientRect(); // Force reflow

                path.style.transition = `stroke-dashoffset ${BORDER_ANIM_DURATION}ms cubic-bezier(0.6,0,0.4,1)`;
                path.style.strokeDashoffset = 0;

                // Reveal card content after border animation
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s cubic-bezier(0.6,0,0.4,1)';
                    card.style.opacity = 1;
                    setTimeout(() => {
                        if (neonBorder.parentNode === card) {
                            card.removeChild(neonBorder);
                        }
                        card.classList.remove('revealing');
                        card.style.transition = '';
                    }, 350);
                }, BORDER_ANIM_DURATION + 100);

                observer.unobserve(entry.target);
            }
        });
    };

    const cardObserver = new IntersectionObserver(revealCards, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    cardLinks.forEach(link => cardObserver.observe(link));
})();
