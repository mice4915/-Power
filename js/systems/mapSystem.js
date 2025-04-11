// Map System - Handles the interactive map functionality

import { districts, districtStatus, calculateDistrictPower } from '../config/districts.js';

class MapSystem {
    constructor() {
        this.selectedDistrict = null;
        this.canvas = null;
        this.ctx = null;
        this.mapImage = null;
        this.hoveredDistrict = null;
        this.districtStates = new Map();
        this.initialized = false;
    }

    async initialize() {
        try {
            // Create and setup canvas
            this.canvas = document.getElementById('mapCanvas');
            if (!this.canvas) {
                throw new Error('Map canvas element not found');
            }

            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = 900;
            this.canvas.height = 600;

            // Load map image
            await this.loadMapImage();

            // Initialize district states
            this.initializeDistrictStates();

            // Setup event listeners
            this.setupEventListeners();

            this.initialized = true;
            this.render();

            console.log('Map system initialized successfully');
        } catch (error) {
            console.error('Error initializing map system:', error);
            this.showError('Failed to initialize map system');
        }
    }

    async loadMapImage() {
        return new Promise((resolve, reject) => {
            this.mapImage = new Image();
            this.mapImage.src = 'https://images.pexels.com/photos/4021521/pexels-photo-4021521.jpeg';
            this.mapImage.onload = () => resolve();
            this.mapImage.onerror = () => reject(new Error('Failed to load map image'));
        });
    }

    initializeDistrictStates() {
        Object.entries(districts).forEach(([key, district]) => {
            this.districtStates.set(key, {
                status: districtStatus.NEUTRAL,
                support: district.baseSupport,
                influence: 0
            });
        });
    }

    setupEventListeners() {
        // Mouse move for hover effects
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleHover(x, y);
        });

        // Click for district selection
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleClick(x, y);
        });

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.handleClick(x, y);
        });
    }

    handleHover(x, y) {
        const hoveredDistrict = this.getDistrictAtPosition(x, y);
        if (this.hoveredDistrict !== hoveredDistrict) {
            this.hoveredDistrict = hoveredDistrict;
            this.render();
            this.updateDistrictInfo(hoveredDistrict);
        }
    }

    handleClick(x, y) {
        const clickedDistrict = this.getDistrictAtPosition(x, y);
        if (clickedDistrict) {
            this.selectDistrict(clickedDistrict);
        }
    }

    getDistrictAtPosition(x, y) {
        return Object.entries(districts).find(([_, district]) => {
            const dx = x - district.coordinates.x;
            const dy = y - district.coordinates.y;
            return (dx * dx + dy * dy) <= 400; // 20px radius
        })?.[0];
    }

    selectDistrict(districtKey) {
        if (this.selectedDistrict !== districtKey) {
            this.selectedDistrict = districtKey;
            this.render();
            this.showDistrictModal(districtKey);
        }
    }

    updateDistrictInfo(districtKey) {
        const infoElement = document.getElementById('districtInfo');
        if (!infoElement || !districtKey) return;

        const district = districts[districtKey];
        const state = this.districtStates.get(districtKey);

        infoElement.innerHTML = `
            <h3 class="text-xl font-bold">${district.name}</h3>
            <p class="text-gray-600">${district.description}</p>
            <div class="mt-2">
                <div class="flex justify-between">
                    <span>Support:</span>
                    <span>${state.support}</span>
                </div>
                <div class="flex justify-between">
                    <span>Status:</span>
                    <span>${state.status}</span>
                </div>
            </div>
        `;
    }

    showDistrictModal(districtKey) {
        const district = districts[districtKey];
        const state = this.districtStates.get(districtKey);

        const modalContent = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <h2 class="text-2xl font-bold mb-4">${district.name}</h2>
                    <p class="text-gray-600 mb-4">${district.description}</p>
                    
                    <div class="mb-4">
                        <h3 class="font-bold mb-2">Resources</h3>
                        <div class="grid grid-cols-2 gap-2">
                            <div>Supporters: ${district.resources.supporters}</div>
                            <div>Influence: ${district.resources.influence}</div>
                            <div>Funds: ${district.resources.funds}</div>
                        </div>
                    </div>

                    <div class="mb-4">
                        <h3 class="font-bold mb-2">Challenges</h3>
                        <ul class="list-disc pl-4">
                            ${district.challenges.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="mb-4">
                        <h3 class="font-bold mb-2">Opportunities</h3>
                        <ul class="list-disc pl-4">
                            ${district.opportunities.map(o => `<li>${o}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="flex justify-end mt-6">
                        <button class="bg-blue-500 text-white px-4 py-2 rounded mr-2" onclick="window.mapSystem.startCampaign('${districtKey}')">
                            Start Campaign
                        </button>
                        <button class="bg-gray-300 px-4 py-2 rounded" onclick="window.mapSystem.closeModal()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalContent;
        document.body.appendChild(modalElement);
    }

    closeModal() {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
            modal.remove();
        }
    }

    startCampaign(districtKey) {
        try {
            const district = districts[districtKey];
            const state = this.districtStates.get(districtKey);

            // Update district state
            state.status = districtStatus.ALLIED;
            state.support += 100;
            state.influence += 10;

            this.closeModal();
            this.render();
            this.showNotification(`Campaign started in ${district.name}!`);
        } catch (error) {
            console.error('Error starting campaign:', error);
            this.showError('Failed to start campaign');
        }
    }

    render() {
        if (!this.initialized) return;

        try {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw map background
            this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);

            // Draw districts
            Object.entries(districts).forEach(([key, district]) => {
                const state = this.districtStates.get(key);
                this.drawDistrict(district, state, key === this.hoveredDistrict);
            });
        } catch (error) {
            console.error('Error rendering map:', error);
            this.showError('Failed to render map');
        }
    }

    drawDistrict(district, state, isHovered) {
        const { x, y } = district.coordinates;
        const radius = 20;

        // Draw district circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        // Set color based on status
        let color;
        switch (state.status) {
            case districtStatus.ALLIED:
                color = '#4CAF50';
                break;
            case districtStatus.OPPOSED:
                color = '#f44336';
                break;
            case districtStatus.CONTROLLED:
                color = '#2196F3';
                break;
            default:
                color = '#9e9e9e';
        }

        this.ctx.fillStyle = isHovered ? this.lightenColor(color, 20) : color;
        this.ctx.fill();

        // Draw district name
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(district.name, x, y + radius + 15);
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return `#${(1 << 24 | (R < 255 ? R : 255) << 16 | (G < 255 ? G : 255) << 8 | (B < 255 ? B : 255)).toString(16).slice(1)}`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showError(message) {
        const error = document.createElement('div');
        error.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg';
        error.textContent = message;
        document.body.appendChild(error);
        setTimeout(() => error.remove(), 3000);
    }
}

// Create and export map system instance
const mapSystem = new MapSystem();
export default mapSystem;

// Make it available globally for HTML event handlers
window.mapSystem = mapSystem;
