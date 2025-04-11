// Event Management System

import { districts, districtStatus } from '../config/districts.js';
import resourceSystem from './resourceSystem.js';
import allianceSystem from './allianceSystem.js';
import profileSystem from './profileSystem.js';

class EventSystem {
    constructor() {
        this.activeEvents = new Map();
        this.eventHistory = [];
        this.eventTypes = {
            PROTEST: 'protest',
            ECONOMIC: 'economic',
            POLITICAL: 'political',
            NATURAL: 'natural',
            SOCIAL: 'social'
        };

        this.events = {
            // Protest Events
            PEACEFUL_DEMONSTRATION: {
                type: 'protest',
                title: 'Peaceful Demonstration',
                description: 'A peaceful demonstration has begun in the district.',
                duration: 3,
                effects: {
                    supporters: 200,
                    influence: 10
                },
                choices: [
                    {
                        text: 'Join the demonstration',
                        outcome: 'Joining the demonstration increases support but requires resources.',
                        success: {
                            supporters: 400,
                            influence: 20
                        },
                        cost: {
                            funds: 1000
                        }
                    },
                    {
                        text: 'Observe from distance',
                        outcome: 'Maintaining distance provides moderate benefits with no cost.',
                        success: {
                            supporters: 100,
                            influence: 5
                        }
                    }
                ]
            },

            // Economic Events
            ECONOMIC_CRISIS: {
                type: 'economic',
                title: 'Economic Crisis',
                description: 'An economic crisis is affecting the district.',
                duration: 5,
                effects: {
                    funds: -2000,
                    supporters: -100
                },
                choices: [
                    {
                        text: 'Provide economic aid',
                        outcome: 'Supporting the community during crisis builds trust.',
                        success: {
                            supporters: 300,
                            influence: 15
                        },
                        cost: {
                            funds: 5000
                        }
                    },
                    {
                        text: 'Focus on stability',
                        outcome: 'Maintaining stability minimizes losses.',
                        success: {
                            funds: -1000
                        }
                    }
                ]
            },

            // Political Events
            POLITICAL_SCANDAL: {
                type: 'political',
                title: 'Political Scandal',
                description: 'A political scandal has erupted in the district.',
                duration: 4,
                effects: {
                    influence: -20,
                    supporters: -200
                },
                choices: [
                    {
                        text: 'Launch investigation',
                        outcome: 'A thorough investigation shows commitment to transparency.',
                        success: {
                            influence: 30,
                            supporters: 100
                        },
                        cost: {
                            funds: 3000
                        }
                    },
                    {
                        text: 'Distance from scandal',
                        outcome: 'Maintaining distance helps avoid negative association.',
                        success: {
                            influence: -10
                        }
                    }
                ]
            },

            // Natural Events
            NATURAL_DISASTER: {
                type: 'natural',
                title: 'Natural Disaster',
                description: 'A natural disaster has struck the district.',
                duration: 6,
                effects: {
                    supporters: -300,
                    funds: -3000
                },
                choices: [
                    {
                        text: 'Organize relief efforts',
                        outcome: 'Leading relief efforts shows strong leadership.',
                        success: {
                            supporters: 500,
                            influence: 25
                        },
                        cost: {
                            funds: 8000
                        }
                    },
                    {
                        text: 'Coordinate with authorities',
                        outcome: 'Working with authorities provides moderate benefits.',
                        success: {
                            supporters: 200,
                            influence: 10
                        },
                        cost: {
                            funds: 3000
                        }
                    }
                ]
            },

            // Social Events
            COMMUNITY_FESTIVAL: {
                type: 'social',
                title: 'Community Festival',
                description: 'A community festival is being organized.',
                duration: 2,
                effects: {
                    supporters: 100,
                    influence: 5
                },
                choices: [
                    {
                        text: 'Sponsor the festival',
                        outcome: 'Sponsoring the festival increases visibility and support.',
                        success: {
                            supporters: 300,
                            influence: 15
                        },
                        cost: {
                            funds: 4000
                        }
                    },
                    {
                        text: 'Attend as guest',
                        outcome: 'Attending as a guest shows support without major investment.',
                        success: {
                            supporters: 150,
                            influence: 8
                        }
                    }
                ]
            }
        };

        this.initialized = false;
    }

    initialize() {
        try {
            // Start event generation interval
            this.startEventGeneration();
            this.initialized = true;
            console.log('Event system initialized successfully');
        } catch (error) {
            console.error('Error initializing event system:', error);
            this.showError('Failed to initialize event system');
        }
    }

    startEventGeneration() {
        // Generate new events periodically
        setInterval(() => {
            this.generateRandomEvent();
        }, 60000); // Generate event every minute
    }

    generateRandomEvent() {
        try {
            // Select random district
            const districtKeys = Object.keys(districts);
            const randomDistrict = districtKeys[Math.floor(Math.random() * districtKeys.length)];

            // Select random event
            const eventKeys = Object.keys(this.events);
            const randomEvent = this.events[eventKeys[Math.floor(Math.random() * eventKeys.length)]];

            this.triggerEvent(randomDistrict, randomEvent);
        } catch (error) {
            console.error('Error generating random event:', error);
        }
    }

    triggerEvent(districtKey, event) {
        try {
            const eventId = `${Date.now()}-${districtKey}`;
            const newEvent = {
                id: eventId,
                district: districtKey,
                ...event,
                startTime: Date.now(),
                status: 'active',
                resolved: false
            };

            this.activeEvents.set(eventId, newEvent);
            this.applyEventEffects(districtKey, event.effects);
            this.showEventNotification(newEvent);

            // Add to history
            this.eventHistory.push({
                ...newEvent,
                timestamp: Date.now()
            });

            return eventId;
        } catch (error) {
            console.error('Error triggering event:', error);
            this.showError('Failed to trigger event');
            return null;
        }
    }

    resolveEvent(eventId, choiceIndex) {
        try {
            const event = this.activeEvents.get(eventId);
            if (!event || event.resolved) {
                throw new Error('Event not found or already resolved');
            }

            const choice = event.choices[choiceIndex];
            if (!choice) {
                throw new Error('Invalid choice');
            }

            // Check if player has required resources
            if (choice.cost) {
                for (const [resource, amount] of Object.entries(choice.cost)) {
                    if (!resourceSystem.removeResource(resource, amount)) {
                        throw new Error(`Insufficient ${resource}`);
                    }
                }
            }

            // Apply choice effects
            this.applyEventEffects(event.district, choice.success);

            // Update event status
            event.resolved = true;
            event.resolution = {
                choice: choiceIndex,
                timestamp: Date.now()
            };

            // Update history
            const historyEvent = this.eventHistory.find(e => e.id === eventId);
            if (historyEvent) {
                historyEvent.resolution = event.resolution;
            }

            // Remove from active events after duration
            setTimeout(() => {
                this.activeEvents.delete(eventId);
            }, event.duration * 1000);

            // Award experience
            profileSystem.addExperience(100);

            this.showNotification(`Event resolved: ${event.title}`);
            return true;
        } catch (error) {
            console.error('Error resolving event:', error);
            this.showError(error.message);
            return false;
        }
    }

    applyEventEffects(districtKey, effects) {
        try {
            for (const [resource, amount] of Object.entries(effects)) {
                if (amount > 0) {
                    resourceSystem.addResource(resource, amount);
                } else {
                    resourceSystem.removeResource(resource, Math.abs(amount));
                }
            }
        } catch (error) {
            console.error('Error applying event effects:', error);
        }
    }

    getActiveEvents() {
        return Array.from(this.activeEvents.values());
    }

    getDistrictEvents(districtKey) {
        return this.getActiveEvents().filter(event => event.district === districtKey);
    }

    getEventHistory() {
        return this.eventHistory;
    }

    showEventNotification(event) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-semibold mb-2">${event.title}</h3>
                <p class="text-gray-600 mb-4">${event.description}</p>
                <p class="text-sm text-gray-500 mb-4">Location: ${districts[event.district].name}</p>
                <div class="space-y-2">
                    ${event.choices.map((choice, index) => `
                        <button onclick="eventSystem.resolveEvent('${event.id}', ${index})"
                                class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                            ${choice.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
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

// Create and export event system instance
const eventSystem = new EventSystem();
export default eventSystem;

// Make it available globally for HTML event handlers
window.eventSystem = eventSystem;
