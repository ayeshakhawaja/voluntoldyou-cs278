/************

This was the original backend code written for the milestone. It was modified and
incorporated into wix.js to work with the finalized frontend code.

****/

const preferences = ["health", "education"];
const ids = ["ed_com", "hum_art_com"];

let opportunities = [{
    title: "Volunteer Opportunity 1",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["education", "community"],
    key: "ed_com"
}, {
    title: "Volunteer Opportunity 2",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["environment"],
    key: "env"
}, {
    title: "Volunteer Opportunity 3",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["human rights", "arts & culture", "community"],
    key: "hum_art_com"
}, {
    title: "Volunteer Opportunity 4",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["faith", "community", "human rights"],
    key: "faith_com_hum"
}, {
    title: "Volunteer Opportunity 5",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["faith"],
    key: "faith"
}, {
    title: "Volunteer Opportunity 6",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["education", "community"],
    key: "ed_com2"
}, {
    title: "Volunteer Opportunity 7",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["health", "community"],
    key: "health_com"
}, {
    title: "Volunteer Opportunity 8",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["community"],
    key: "com"
}, {
    title: "Volunteer Opportunity 9",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["education", "community", "human rights"],
    key: "ed_com_hum"
}, {
    title: "Volunteer Opportunity 10",
    date: "May 29, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "123 Main St, Stanford, CA 94305",
    description: "Here's a short description of the opportunity.",
    contact: {name: "Jane Doe", email: "abc@stanford.edu"},
    tags: ["arts & culture"],
    key: "art"
}]

const rankOpportunities = ({preferences, opportunities}) => {
    let numOpps = 3
    let bestOpportunities = [];
    if (opportunities.length < 3) {
        numOpps = opportunities.length;
    }

    // if no opportunities fit user's preferences, return random opportunities
    let presentTags = []
    for (let a = 0; a < opportunities.length; a++) {
        let tags = opportunities[a].tags;
        for (let b = 0; b < tags.length; b++) {
            if (!presentTags.includes(tags[b])) {
                presentTags.push(tags[b]);
            }
        }
    }
    let noPreferencesPresent = false;
    for (let b = 0; b < preferences.length; b++) {
        if (presentTags.includes(preferences[b])) {
            break;
        }
        if (b === preferences.length - 1) {
            noPreferencesPresent = true;
        }
    }
    if (preferences.length === 0 || noPreferencesPresent) {
        let indices = [];
        while (indices.length < numOpps) {
            let index = Math.floor(Math.random() * opportunities.length);
            if (!indices.includes(index)) {
                indices.push(index);
                bestOpportunities.push(opportunities[index].key);
            }
        }
        return bestOpportunities;
    }

    // find all opportunities that match the user's preferences
    let matchingOpportunities = {};
    for (let i = 0; i < opportunities.length; i++) {
        let curOpportunity = opportunities[i];
        let key = curOpportunity.key;
        for (let j = 0; j < preferences.length; j++) {
            if (curOpportunity.tags.includes(preferences[j])) {
                if (!matchingOpportunities.hasOwnProperty(key)) {
                    // we need to add opp to array
                    matchingOpportunities[key] = 1;
                } else {
                    // opp is in array, we just need to update the matches
                    matchingOpportunities[key]++;
                }
            }
        }
    }

    // now find opportunities with the most matches
    matchingOpportunities = Object.entries(matchingOpportunities);
    matchingOpportunities.sort((a, b) => b[1] - a[1]);
    // avoid indexing errors
    if (matchingOpportunities.length < numOpps) {
        numOpps = matchingOpportunities.length;
    }
    bestOpportunities = matchingOpportunities.slice(0, numOpps);
    bestOpportunities = Object.fromEntries(bestOpportunities);
    return Object.keys(bestOpportunities);
}

// given a list of opportunity ids, return corresponding opportunities
const getOppsFromIds = ({opportunities, ids}) => {
    let opps = [];
    for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < opportunities.length; j++) {
            if (opportunities[j].key === ids[i]) {
                opps.push(opportunities[j]);
                break;
            }
        }
    }
    return opps;
}

console.log(getOppsFromIds({opportunities, ids}));
