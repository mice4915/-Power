// Profile Management System

class ProfileSystem {
    constructor() {
        this.profile = {
            name: '',
            title: 'Movement Leader',
            level: 1,
            experience: 0,
            achievements: [],
            statistics: {
                daysInPower: 0,
                totalSupporters: 0,
                alliances: 0,
                resourcesGenerated: {
                    supporters: 0,
                    influence: 0,
                    funds: 0
                },
                districtsControlled: 0,
                eventsCompleted: 0
            },
            badges: []
        };

        this.achievements = {
            FIRST_ALLIANCE: {
                id: 'first_alliance',
                name: 'First Alliance',
                description: 'Form your first alliance with another district',
                icon: 'handshake'
            },
            MASS_SUPPORT: {
                id: 'mass_support',
                name: 'Mass Support',
                description: 'Reach 10,000 total supporters',
                icon: 'users'
            },
            DISTRICT_CONTROL: {
                id: 'district_control',
                name: 'District Control',
                description: 'Control your first district completely',
                icon: 'flag'
            },
            RESOURCE_MASTER: {
                id: 'resource_master',
                name: 'Resource Master',
                description: 'Generate 100,000 total resources',
                icon: 'coins'
            },
            DIPLOMATIC_GENIUS: {
                id: 'diplomatic_genius',
                name: 'Diplomatic Genius',
                description: 'Form alliances with 5 districts simultaneously',
                icon: 'star'
            }
        };

        this.badges = {
            NEWCOMER: {
                id: 'newcomer',
                name: 'Newcomer',
                description: 'Just started your journey',
                icon: 'seedling'
            },
            ORGANIZER: {
                id: 'organizer',
                name: 'Master Organizer',
                description: 'Successfully organized 10 rallies',
                icon: 'bullhorn'
            },
            NEGOTIATOR: {
                id: 'negotiator',
                name: 'Skilled Negotiator',
                description: 'Maintain positive relations with all districts',
                icon: 'comments'
            },
            LEADER: {
                id: 'leader',
                name: 'Natural Leader',
                description: 'Reach level 10',
                icon: 'crown'
            }
        };

        this.initialized = false;
    }

    initialize() {
        try {
            this.loadProfile();
            this.initialized = true;
            console.log('Profile system initialized successfully');
        } catch (error) {
            console.error('Error initializing profile system:', error);
            this.showError('Failed to initialize profile system');
        }
    }

    loadProfile() {
        try {
            const savedProfile = localStorage.getItem('peoplepower_profile');
            if (savedProfile) {
                this.profile = JSON.parse(savedProfile);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showError('Failed to load profile');
        }
    }

    saveProfile() {
        try {
            localStorage.setItem('peoplepower_profile', JSON.stringify(this.profile));
            console.log('Profile saved successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showError('Failed to save profile');
        }
    }

    updateProfile(updates) {
        try {
            Object.assign(this.profile, updates);
            this.saveProfile();
            this.updateUI();
            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showError('Failed to update profile');
            return false;
        }
    }

    addExperience(amount) {
        try {
            this.profile.experience += amount;
            
            // Check for level up
            const newLevel = Math.floor(this.profile.experience / 1000) + 1;
            if (newLevel > this.profile.level) {
                this.levelUp(newLevel);
            }

            this.saveProfile();
            this.updateUI();
        } catch (error) {
            console.error('Error adding experience:', error);
            this.showError('Failed to add experience');
        }
    }

    levelUp(newLevel) {
        const oldLevel = this.profile.level;
        this.profile.level = newLevel;
        
        // Check for level-based badges
        if (newLevel >= 10 && !this.hasBadge('LEADER')) {
            this.awardBadge('LEADER');
        }

        this.showNotification(`Level Up! ${oldLevel} → ${newLevel}`);
    }

    updateStatistic(stat, value) {
        try {
            if (stat in this.profile.statistics) {
                if (typeof value === 'object') {
                    Object.assign(this.profile.statistics[stat], value);
                } else {
                    this.profile.statistics[stat] = value;
                }
                this.checkAchievements();
                this.saveProfile();
                this.updateUI();
            }
        } catch (error) {
            console.error('Error updating statistic:', error);
            this.showError('Failed to update statistic');
        }
    }

    awardAchievement(achievementId) {
        try {
            if (this.achievements[achievementId] && 
                !this.profile.achievements.includes(achievementId)) {
                this.profile.achievements.push(achievementId);
                this.addExperience(500); // Award XP for achievement
                this.saveProfile();
                this.showNotification(`Achievement Unlocked: ${this.achievements[achievementId].name}`);
            }
        } catch (error) {
            console.error('Error awarding achievement:', error);
            this.showError('Failed to award achievement');
        }
    }

    awardBadge(badgeId) {
        try {
            if (this.badges[badgeId] && !this.profile.badges.includes(badgeId)) {
                this.profile.badges.push(badgeId);
                this.addExperience(300); // Award XP for badge
                this.saveProfile();
                this.showNotification(`Badge Earned: ${this.badges[badgeId].name}`);
            }
        } catch (error) {
            console.error('Error awarding badge:', error);
            this.showError('Failed to award badge');
        }
    }

    hasAchievement(achievementId) {
        return this.profile.achievements.includes(achievementId);
    }

    hasBadge(badgeId) {
        return this.profile.badges.includes(badgeId);
    }

    checkAchievements() {
        // Check for achievements based on statistics
        if (this.profile.statistics.alliances >= 1 && 
            !this.hasAchievement('FIRST_ALLIANCE')) {
            this.awardAchievement('FIRST_ALLIANCE');
        }

        if (this.profile.statistics.totalSupporters >= 10000 && 
            !this.hasAchievement('MASS_SUPPORT')) {
            this.awardAchievement('MASS_SUPPORT');
        }

        if (this.profile.statistics.districtsControlled >= 1 && 
            !this.hasAchievement('DISTRICT_CONTROL')) {
            this.awardAchievement('DISTRICT_CONTROL');
        }

        const totalResources = 
            this.profile.statistics.resourcesGenerated.supporters +
            this.profile.statistics.resourcesGenerated.influence +
            this.profile.statistics.resourcesGenerated.funds;
        
        if (totalResources >= 100000 && 
            !this.hasAchievement('RESOURCE_MASTER')) {
            this.awardAchievement('RESOURCE_MASTER');
        }

        if (this.profile.statistics.alliances >= 5 && 
            !this.hasAchievement('DIPLOMATIC_GENIUS')) {
            this.awardAchievement('DIPLOMATIC_GENIUS');
        }
    }

    getProgress() {
        const currentLevelXP = (this.profile.level - 1) * 1000;
        const nextLevelXP = this.profile.level * 1000;
        const currentXP = this.profile.experience - currentLevelXP;
        const neededXP = nextLevelXP - currentLevelXP;
        
        return {
            current: currentXP,
            needed: neededXP,
            percentage: (currentXP / neededXP) * 100
        };
    }

    updateUI() {
        try {
            // Update profile information
            const nameElement = document.getElementById('profile-name');
            if (nameElement) nameElement.textContent = this.profile.name;

            const titleElement = document.getElementById('profile-title');
            if (titleElement) titleElement.textContent = this.profile.title;

            const levelElement = document.getElementById('profile-level');
            if (levelElement) levelElement.textContent = this.profile.level;

            // Update experience bar
            const progress = this.getProgress();
            const progressBar = document.getElementById('experience-bar');
            if (progressBar) {
                progressBar.style.width = `${progress.percentage}%`;
                progressBar.setAttribute('aria-valuenow', progress.percentage);
            }

            const progressText = document.getElementById('experience-text');
            if (progressText) {
                progressText.textContent = `${progress.current}/${progress.needed} XP`;
            }

            // Update statistics
            Object.entries(this.profile.statistics).forEach(([stat, value]) => {
                const element = document.getElementById(`stat-${stat}`);
                if (element) {
                    if (typeof value === 'object') {
                        element.textContent = Object.values(value).reduce((a, b) => a + b, 0);
                    } else {
                        element.textContent = value;
                    }
                }
            });

            // Update achievements
            const achievementsContainer = document.getElementById('achievements-list');
            if (achievementsContainer) {
                achievementsContainer.innerHTML = this.profile.achievements
                    .map(id => this.achievements[id])
                    .map(achievement => `
                        <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <i class="fas fa-${achievement.icon} text-yellow-500"></i>
                            <div>
                                <div class="font-semibold">${achievement.name}</div>
                                <div class="text-sm text-gray-600">${achievement.description}</div>
                            </div>
                        </div>
                    `).join('');
            }

            // Update badges
            const badgesContainer = document.getElementById('badges-list');
            if (badgesContainer) {
                badgesContainer.innerHTML = this.profile.badges
                    .map(id => this.badges[id])
                    .map(badge => `
                        <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <i class="fas fa-${badge.icon} text-blue-500"></i>
                            <div>
                                <div class="font-semibold">${badge.name}</div>
                                <div class="text-sm text-gray-600">${badge.description}</div>
                            </div>
                        </div>
                    `).join('');
            }
        } catch (error) {
            console.error('Error updating UI:', error);
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

// Create and export profile system instance
const profileSystem = new ProfileSystem();
export default profileSystem;

// Make it available globally for HTML event handlers
window.profileSystem = profileSystem;
