// Alliance Management System

import { districts, districtStatus } from '../config/districts.js';

class AllianceSystem {
    constructor() {
        this.alliances = new Map(); // Map of district pairs that are allied
        this.relations = new Map(); // Map of district relations (-100 to 100)
        this.treaties = new Map(); // Map of active treaties and their terms
        this.initialized = false;
    }

    initialize() {
        try {
            // Initialize relations for all districts
            Object.keys(districts).forEach(district1 => {
                this.relations.set(district1, new Map());
                Object.keys(districts).forEach(district2 => {
                    if (district1 !== district2) {
                        // Initialize with slightly random relations
                        const initialRelation = Math.floor(Math.random() * 40) - 20; // -20 to +20
                        this.relations.get(district1).set(district2, initialRelation);
                    }
                });
            });

            this.initialized = true;
            console.log('Alliance system initialized successfully');
        } catch (error) {
            console.error('Error initializing alliance system:', error);
            this.showError('Failed to initialize alliance system');
        }
    }

    proposeAlliance(district1, district2) {
        try {
            if (this.areAllied(district1, district2)) {
                throw new Error('Districts are already allied');
            }

            const relation = this.getRelation(district1, district2);
            const chance = this.calculateAllianceChance(relation);

            if (Math.random() * 100 < chance) {
                this.formAlliance(district1, district2);
                this.showNotification(`Alliance formed between ${districts[district1].name} and ${districts[district2].name}`);
                return true;
            } else {
                this.showNotification(`${districts[district2].name} rejected the alliance proposal`);
                return false;
            }
        } catch (error) {
            console.error('Error proposing alliance:', error);
            this.showError(error.message);
            return false;
        }
    }

    formAlliance(district1, district2) {
        const allianceKey = this.getAllianceKey(district1, district2);
        this.alliances.set(allianceKey, {
            formed: new Date(),
            terms: {
                resourceSharing: true,
                mutualDefense: true,
                duration: 30 // days
            }
        });

        // Improve relations
        this.modifyRelation(district1, district2, 20);
    }

    breakAlliance(district1, district2) {
        try {
            const allianceKey = this.getAllianceKey(district1, district2);
            if (!this.alliances.has(allianceKey)) {
                throw new Error('No alliance exists between these districts');
            }

            this.alliances.delete(allianceKey);
            
            // Deteriorate relations
            this.modifyRelation(district1, district2, -30);

            this.showNotification(`Alliance between ${districts[district1].name} and ${districts[district2].name} has been broken`);
            return true;
        } catch (error) {
            console.error('Error breaking alliance:', error);
            this.showError(error.message);
            return false;
        }
    }

    areAllied(district1, district2) {
        const allianceKey = this.getAllianceKey(district1, district2);
        return this.alliances.has(allianceKey);
    }

    getAllianceKey(district1, district2) {
        // Ensure consistent key regardless of order
        return [district1, district2].sort().join(':');
    }

    getRelation(district1, district2) {
        return this.relations.get(district1).get(district2);
    }

    modifyRelation(district1, district2, amount) {
        const currentRelation = this.getRelation(district1, district2);
        const newRelation = Math.max(-100, Math.min(100, currentRelation + amount));
        
        // Update relations both ways
        this.relations.get(district1).set(district2, newRelation);
        this.relations.get(district2).set(district1, newRelation);

        // Update UI if available
        this.updateRelationsUI(district1, district2);
    }

    calculateAllianceChance(relation) {
        // Base chance is 50%, modified by relation
        return 50 + relation;
    }

    getAllAlliances() {
        const allAlliances = [];
        this.alliances.forEach((details, key) => {
            const [district1, district2] = key.split(':');
            allAlliances.push({
                districts: [district1, district2],
                details: details
            });
        });
        return allAlliances;
    }

    getDistrictAlliances(district) {
        return this.getAllAlliances().filter(alliance => 
            alliance.districts.includes(district)
        );
    }

    proposeTreaty(district1, district2, terms) {
        try {
            if (!this.areAllied(district1, district2)) {
                throw new Error('Districts must be allied to form treaties');
            }

            const treatyKey = this.getAllianceKey(district1, district2);
            this.treaties.set(treatyKey, {
                formed: new Date(),
                terms: terms,
                status: 'pending'
            });

            // Simulate AI response based on relations
            const relation = this.getRelation(district1, district2);
            if (Math.random() * 100 < this.calculateTreatyChance(relation)) {
                this.acceptTreaty(district1, district2);
                return true;
            } else {
                this.rejectTreaty(district1, district2);
                return false;
            }
        } catch (error) {
            console.error('Error proposing treaty:', error);
            this.showError(error.message);
            return false;
        }
    }

    acceptTreaty(district1, district2) {
        const treatyKey = this.getAllianceKey(district1, district2);
        const treaty = this.treaties.get(treatyKey);
        if (treaty) {
            treaty.status = 'active';
            this.modifyRelation(district1, district2, 10);
            this.showNotification(`Treaty accepted between ${districts[district1].name} and ${districts[district2].name}`);
        }
    }

    rejectTreaty(district1, district2) {
        const treatyKey = this.getAllianceKey(district1, district2);
        this.treaties.delete(treatyKey);
        this.modifyRelation(district1, district2, -5);
        this.showNotification(`Treaty rejected by ${districts[district2].name}`);
    }

    calculateTreatyChance(relation) {
        // Base chance is 40%, modified by relation
        return 40 + (relation / 2);
    }

    updateRelationsUI(district1, district2) {
        try {
            const relation = this.getRelation(district1, district2);
            
            // Update relation display if it exists
            const relationElement = document.getElementById(`relation-${district1}-${district2}`);
            if (relationElement) {
                relationElement.textContent = relation;
                
                // Update color based on relation value
                if (relation > 50) {
                    relationElement.className = 'text-green-600';
                } else if (relation < -50) {
                    relationElement.className = 'text-red-600';
                } else {
                    relationElement.className = 'text-gray-600';
                }
            }

            // Update alliance status if it exists
            const statusElement = document.getElementById(`alliance-status-${district1}-${district2}`);
            if (statusElement) {
                const allied = this.areAllied(district1, district2);
                statusElement.textContent = allied ? 'Allied' : 'Not Allied';
                statusElement.className = allied ? 'text-green-600' : 'text-gray-600';
            }
        } catch (error) {
            console.error('Error updating relations UI:', error);
        }
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

// Create and export alliance system instance
const allianceSystem = new AllianceSystem();
export default allianceSystem;

// Make it available globally for HTML event handlers
window.allianceSystem = allianceSystem;
