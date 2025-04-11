// Main JavaScript file for global functionality

// Game state management
const gameState = {
    initialized: false,
    currentDistrict: null,
    resources: {
        supporters: 1000,
        influence: 50,
        funds: 5000
    },
    alliances: [],
    events: []
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    initializeMobileMenu();
    initializeScrollEffects();
    setupEventListeners();
});

// Game initialization
function initializeGame() {
    if (!gameState.initialized) {
        loadGameState();
        gameState.initialized = true;
        console.log('Game initialized successfully');
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.querySelector('nav button');
    const closeButton = document.querySelector('#mobile-menu button');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', toggleMobileMenu);
        closeButton.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// Scroll effects
function initializeScrollEffects() {
    const scrollElements = document.querySelectorAll('.scroll-fade');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('animate-fadeIn');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
}

// Event listeners setup
function setupEventListeners() {
    // Start game button
    const startButton = document.querySelector('a[href="map.html"]');
    if (startButton) {
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            startGame();
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Game state management
function loadGameState() {
    try {
        const savedState = localStorage.getItem('peoplepower_gameState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            Object.assign(gameState, parsedState);
            console.log('Game state loaded successfully');
        }
    } catch (error) {
        console.error('Error loading game state:', error);
        showNotification('Error loading game state', 'error');
    }
}

function saveGameState() {
    try {
        localStorage.setItem('peoplepower_gameState', JSON.stringify(gameState));
        console.log('Game state saved successfully');
    } catch (error) {
        console.error('Error saving game state:', error);
        showNotification('Error saving game state', 'error');
    }
}

// Game start function
function startGame() {
    try {
        // Initialize new game state if needed
        if (!gameState.initialized) {
            initializeGame();
        }
        // Redirect to map page
        window.location.href = 'map.html';
    } catch (error) {
        console.error('Error starting game:', error);
        showNotification('Error starting game', 'error');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export game state and functions for use in other modules
window.gameState = gameState;
window.saveGameState = saveGameState;
window.loadGameState = loadGameState;
