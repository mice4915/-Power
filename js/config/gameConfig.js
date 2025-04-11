// Game Configuration and Constants

export const gameConfig = {
    // Game Version
    version: '1.0.0',
    
    // Game Settings
    settings: {
        autosaveInterval: 60000, // 1 minute
        eventGenerationInterval: 60000, // 1 minute
        resourceGenerationInterval: 10000, // 10 seconds
    },

    // Resource Configuration
    resources: {
        supporters: {
            baseGeneration: 10,
            maxStorage: 100000,
            initialAmount: 1000,
            generationMultiplier: 1.5
        },
        influence: {
            baseGeneration: 5,
            maxStorage: 10000,
            initialAmount: 100,
            generationMultiplier: 1.2
        },
        funds: {
            baseGeneration: 100,
            maxStorage: 1000000,
            initialAmount: 5000,
            generationMultiplier: 1.3
        }
    },

    // District Configuration
    districts: {
        maxLevel: 10,
        upgradeMultiplier: 1.5,
        maxAlliances: 5,
        relationshipRange: {
            min: -100,
            max: 100
        },
        controlThreshold: 75, // Percentage of support needed to control district
    },

    // Experience and Leveling
    experience: {
        baseXPPerLevel: 1000,
        levelMultiplier: 1.5,
        maxLevel: 50,
        xpGain: {
            eventCompletion: 100,
            allianceFormation: 200,
            districtControl: 500,
            resourceMilestone: 300
        }
    },

    // Event Configuration
    events: {
        maxActiveEvents: 5,
        baseEventDuration: 300000, // 5 minutes
        eventTypes: ['protest', 'economic', 'political', 'natural', 'social'],
        eventProbabilities: {
            protest: 0.3,
            economic: 0.2,
            political: 0.2,
            natural: 0.1,
            social: 0.2
        },
        outcomes: {
            success: {
                minThreshold: 0.7,
                maxBonus: 1.5
            },
            failure: {
                maxPenalty: 0.5
            }
        }
    },

    // Alliance Configuration
    alliances: {
        maxAlliances: 5,
        formationCost: {
            influence: 50,
            funds: 1000
        },
        benefits: {
            resourceBonus: 0.2,
            supportGeneration: 0.15,
            influenceGain: 0.25
        },
        relationshipImpact: {
            formation: 20,
            breaking: -30,
            treaty: 10
        }
    },

    // Achievement Thresholds
    achievements: {
        supporters: {
            bronze: 5000,
            silver: 25000,
            gold: 100000
        },
        influence: {
            bronze: 1000,
            silver: 5000,
            gold: 20000
        },
        funds: {
            bronze: 10000,
            silver: 50000,
            gold: 200000
        },
        districts: {
            bronze: 5,
            silver: 10,
            gold: 20
        },
        alliances: {
            bronze: 3,
            silver: 8,
            gold: 15
        }
    },

    // UI Configuration
    ui: {
        notifications: {
            duration: 3000,
            position: 'bottom-right'
        },
        animations: {
            duration: 300,
            easing: 'ease-in-out'
        },
        colors: {
            primary: '#3B82F6', // blue-500
            secondary: '#6B7280', // gray-500
            success: '#10B981', // green-500
            danger: '#EF4444', // red-500
            warning: '#F59E0B', // yellow-500
            info: '#6366F1' // indigo-500
        },
        themes: {
            light: {
                background: '#F3F4F6',
                text: '#1F2937',
                border: '#E5E7EB'
            },
            dark: {
                background: '#1F2937',
                text: '#F9FAFB',
                border: '#374151'
            }
        }
    },

    // Game Mechanics
    mechanics: {
        // Support decay rate per day
        supportDecay: 0.05,
        
        // Influence effectiveness
        influenceEffectiveness: 0.8,
        
        // Resource generation modifiers
        resourceModifiers: {
            district: 0.1,
            alliance: 0.15,
            event: 0.2
        },
        
        // Combat mechanics
        combat: {
            baseSuccess: 0.6,
            supporterWeight: 0.4,
            influenceWeight: 0.3,
            resourceWeight: 0.3,
            minimumForce: 100
        },
        
        // Time-based mechanics
        time: {
            dayLength: 86400000, // 24 hours in milliseconds
            weekLength: 604800000, // 7 days in milliseconds
            eventCooldown: 3600000 // 1 hour in milliseconds
        }
    },

    // Development Flags
    development: {
        debug: false,
        showLogs: false,
        acceleratedTime: false,
        unlimitedResources: false
    }
};

// Helper functions for game configuration
export const getResourceConfig = (resourceType) => {
    return gameConfig.resources[resourceType];
};

export const getEventConfig = (eventType) => {
    return gameConfig.events.eventTypes.includes(eventType) ? 
        gameConfig.events[eventType] : null;
};

export const getAchievementThreshold = (type, tier) => {
    return gameConfig.achievements[type][tier];
};

export const calculateXPForLevel = (level) => {
    return Math.floor(gameConfig.experience.baseXPPerLevel * 
        Math.pow(gameConfig.experience.levelMultiplier, level - 1));
};

export const getUIConfig = (theme = 'light') => {
    return {
        ...gameConfig.ui,
        theme: gameConfig.ui.themes[theme]
    };
};

export const isDebugMode = () => {
    return gameConfig.development.debug;
};

// Export default configuration
export default gameConfig;
