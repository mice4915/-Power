// Resource Management System

import { districts, resourceRates, calculateResourceGeneration } from '../config/districts.js';

class ResourceSystem {
    constructor() {
        this.resources = {
            supporters: 5000,
            influence: 100,
            funds: 10000
        };
        
        this.resourceLimits = {
            supporters: 100000,
            influence: 1000,
            funds: 1000000
        };

        this.generationRates = {
            supporters: 10,
            influence: 2,
            funds: 100
        };

        this.districtAllocations = new Map();
        this.initialized = false;
    }

    initialize() {
        try {
            // Initialize resource allocations for each district
            Object.keys(districts).forEach(districtKey => {
                this.districtAllocations.set(districtKey, {
                    supporters: 0,
                    influence: 0,
                    funds: 0
                });
            });

            // Start resource generation interval
            this.startResourceGeneration();

            this.initialized = true;
            console.log('Resource system initialized successfully');
        } catch (error) {
            console.error('Error initializing resource system:', error);
            this.showError('Failed to initialize resource system');
        }
    }

    startResourceGeneration() {
        // Generate resources every 10 seconds
        setInterval(() => {
            this.generateResources();
        }, 10000);
    }

    generateResources() {
        try {
            Object.entries(this.generationRates).forEach(([resource, rate]) => {
                const generation = this.calculateTotalGeneration(resource);
                this.addResource(resource, generation);
            });

            // Update UI if available
            this.updateUI();
        } catch (error) {
            console.error('Error generating resources:', error);
            this.showError('Failed to generate resources');
        }
    }

    calculateTotalGeneration(resourceType) {
        let total = this.generationRates[resourceType];

        // Add generation from districts
        this.districtAllocations.forEach((allocation, districtKey) => {
            const district = districts[districtKey];
            total += calculateResourceGeneration(district, resourceType);
        });

        return total;
    }

    addResource(type, amount) {
        const newAmount = this.resources[type] + amount;
        this.resources[type] = Math.min(newAmount, this.resourceLimits[type]);
    }

    removeResource(type, amount) {
        if (this.resources[type] >= amount) {
            this.resources[type] -= amount;
            return true;
        }
        return false;
    }

    allocateToDistrict(districtKey, resourceType, amount) {
        try {
            if (!this.districtAllocations.has(districtKey)) {
                throw new Error(`District ${districtKey} not found`);
            }

            if (amount > this.resources[resourceType]) {
                throw new Error(`Insufficient ${resourceType}`);
            }

            const allocation = this.districtAllocations.get(districtKey);
            allocation[resourceType] += amount;
            this.removeResource(resourceType, amount);

            this.updateUI();
            return true;
        } catch (error) {
            console.error('Error allocating resources:', error);
            this.showError(error.message);
            return false;
        }
    }

    deallocateFromDistrict(districtKey, resourceType, amount) {
        try {
            if (!this.districtAllocations.has(districtKey)) {
                throw new Error(`District ${districtKey} not found`);
            }

            const allocation = this.districtAllocations.get(districtKey);
            if (amount > allocation[resourceType]) {
                throw new Error(`Insufficient ${resourceType} allocated to district`);
            }

            allocation[resourceType] -= amount;
            this.addResource(resourceType, amount);

            this.updateUI();
            return true;
        } catch (error) {
            console.error('Error deallocating resources:', error);
            this.showError(error.message);
            return false;
        }
    }

    getDistrictAllocation(districtKey) {
        return this.districtAllocations.get(districtKey) || null;
    }

    getTotalResources() {
        return { ...this.resources };
    }

    getResourceLimit(type) {
        return this.resourceLimits[type];
    }

    updateUI() {
        try {
            // Update resource displays
            Object.entries(this.resources).forEach(([resource, amount]) => {
                const element = document.getElementById(`${resource}-amount`);
                if (element) {
                    element.textContent = this.formatNumber(amount);
                }

                // Update progress bars
                const progressBar = document.getElementById(`${resource}-progress`);
                if (progressBar) {
                    const percentage = (amount / this.resourceLimits[resource]) * 100;
                    progressBar.style.width = `${percentage}%`;
                }
            });

            // Update district allocations
            this.districtAllocations.forEach((allocation, districtKey) => {
                Object.entries(allocation).forEach(([resource, amount]) => {
                    const element = document.getElementById(`${districtKey}-${resource}`);
                    if (element) {
                        element.textContent = this.formatNumber(amount);
                    }
                });
            });

            // Update generation rates
            Object.entries(this.generationRates).forEach(([resource, rate]) => {
                const element = document.getElementById(`${resource}-rate`);
                if (element) {
                    element.textContent = `+${this.formatNumber(rate)}/10s`;
                }
            });

        } catch (error) {
            console.error('Error updating UI:', error);
            this.showError('Failed to update resource display');
        }
    }

    formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    }

    showError(message) {
        const error = document.createElement('div');
        error.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg';
        error.textContent = message;
        document.body.appendChild(error);
        setTimeout(() => error.remove(), 3000);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Create and export resource system instance
const resourceSystem = new ResourceSystem();
export default resourceSystem;

// Make it available globally for HTML event handlers
window.resourceSystem = resourceSystem;
