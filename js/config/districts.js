// Configuration file for district data

const districts = {
    // Central Region
    kampala: {
        id: 1,
        name: "Kampala",
        region: "Central",
        population: 1500000,
        baseSupport: 5000,
        resources: {
            supporters: 2000,
            influence: 100,
            funds: 10000
        },
        description: "The capital city and major urban center",
        challenges: [
            "High population density",
            "Urban poverty",
            "Social inequality"
        ],
        opportunities: [
            "Media presence",
            "Youth engagement",
            "Business connections"
        ],
        coordinates: { x: 450, y: 300 }
    },
    wakiso: {
        id: 2,
        name: "Wakiso",
        region: "Central",
        population: 1000000,
        baseSupport: 3000,
        resources: {
            supporters: 1500,
            influence: 75,
            funds: 7500
        },
        description: "Suburban district surrounding Kampala",
        challenges: [
            "Rapid urbanization",
            "Infrastructure strain",
            "Environmental concerns"
        ],
        opportunities: [
            "Growing middle class",
            "Educational institutions",
            "Industrial development"
        ],
        coordinates: { x: 430, y: 280 }
    },

    // Northern Region
    gulu: {
        id: 3,
        name: "Gulu",
        region: "Northern",
        population: 300000,
        baseSupport: 2000,
        resources: {
            supporters: 1000,
            influence: 50,
            funds: 5000
        },
        description: "Major northern urban center",
        challenges: [
            "Post-conflict recovery",
            "Youth unemployment",
            "Rural poverty"
        ],
        opportunities: [
            "Peace building",
            "Agricultural development",
            "Cultural heritage"
        ],
        coordinates: { x: 400, y: 150 }
    },
    lira: {
        id: 4,
        name: "Lira",
        region: "Northern",
        population: 250000,
        baseSupport: 1500,
        resources: {
            supporters: 800,
            influence: 40,
            funds: 4000
        },
        description: "Growing northern commercial hub",
        challenges: [
            "Economic disparity",
            "Healthcare access",
            "Educational gaps"
        ],
        opportunities: [
            "Trade center",
            "Community organizing",
            "Youth mobilization"
        ],
        coordinates: { x: 420, y: 180 }
    },

    // Eastern Region
    jinja: {
        id: 5,
        name: "Jinja",
        region: "Eastern",
        population: 400000,
        baseSupport: 2500,
        resources: {
            supporters: 1200,
            influence: 60,
            funds: 6000
        },
        description: "Industrial and tourism center",
        challenges: [
            "Industrial decline",
            "Tourism development",
            "Urban planning"
        ],
        opportunities: [
            "Tourism potential",
            "Industrial revival",
            "Water resources"
        ],
        coordinates: { x: 500, y: 300 }
    },
    mbale: {
        id: 6,
        name: "Mbale",
        region: "Eastern",
        population: 350000,
        baseSupport: 2000,
        resources: {
            supporters: 1000,
            influence: 45,
            funds: 4500
        },
        description: "Eastern regional hub",
        challenges: [
            "Rural development",
            "Agricultural modernization",
            "Youth engagement"
        ],
        opportunities: [
            "Agricultural cooperation",
            "Regional trade",
            "Educational centers"
        ],
        coordinates: { x: 520, y: 280 }
    },

    // Western Region
    mbarara: {
        id: 7,
        name: "Mbarara",
        region: "Western",
        population: 450000,
        baseSupport: 2200,
        resources: {
            supporters: 1100,
            influence: 55,
            funds: 5500
        },
        description: "Western economic powerhouse",
        challenges: [
            "Urban growth",
            "Resource distribution",
            "Social services"
        ],
        opportunities: [
            "Economic diversity",
            "Educational institutions",
            "Cultural integration"
        ],
        coordinates: { x: 350, y: 400 }
    },
    fort_portal: {
        id: 8,
        name: "Fort Portal",
        region: "Western",
        population: 300000,
        baseSupport: 1800,
        resources: {
            supporters: 900,
            influence: 45,
            funds: 4500
        },
        description: "Tourism and cultural center",
        challenges: [
            "Tourism development",
            "Environmental conservation",
            "Cultural preservation"
        ],
        opportunities: [
            "Tourism growth",
            "Cultural heritage",
            "Environmental initiatives"
        ],
        coordinates: { x: 330, y: 350 }
    }
};

// District status types
const districtStatus = {
    NEUTRAL: 'neutral',
    ALLIED: 'allied',
    OPPOSED: 'opposed',
    CONTROLLED: 'controlled'
};

// Resource generation rates per district
const resourceRates = {
    supporters: {
        base: 10,
        multiplier: 1.5
    },
    influence: {
        base: 5,
        multiplier: 1.2
    },
    funds: {
        base: 100,
        multiplier: 1.3
    }
};

// Export configurations
export {
    districts,
    districtStatus,
    resourceRates
};

// Helper functions for district management
export const getDistrictById = (id) => {
    return Object.values(districts).find(district => district.id === id);
};

export const getDistrictsByRegion = (region) => {
    return Object.values(districts).filter(district => district.region === region);
};

export const calculateDistrictPower = (district) => {
    return (district.resources.supporters * 0.5) +
           (district.resources.influence * 2) +
           (district.resources.funds * 0.001);
};

export const calculateResourceGeneration = (district, resourceType) => {
    const rate = resourceRates[resourceType];
    return Math.floor(rate.base * rate.multiplier * (district.baseSupport / 1000));
};
