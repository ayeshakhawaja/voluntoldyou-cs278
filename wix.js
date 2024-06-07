/************

This is the finalized code that was integrated into the home page of our Wix platform.
It incorporates backend calls to our databases to grab user and opportunity information and 
uses frontend code to display that information on the home page.

Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

****/

import wixData from 'wix-data';
import { currentMember } from 'wix-members-frontend';
import { getUser } from 'backend/contacts.web';
import { authentication } from 'wix-members-frontend';
import wixLocation from 'wix-location';

// this function should only keep the first 50 words of any text icon.
function getFirst30Words(text) {
  const words = text.split(/\s+/); // Split text by any whitespace
  const first30Words = words.slice(0, 30); // Get the first 50 words
  return first30Words.join(' '); // Join the words back into a string
}

// this function is run when the page loads
$w.onReady(async function () {
    // refresh page when user logs in
    authentication.onLogin(() => {
        wixLocation.to(wixLocation.url);
    })

    const isLoggedIn = authentication.loggedIn();

    let currentUser;
    let preferences = [];
    if (isLoggedIn) {
        // get current user who's logged in
        await getCurrentUser().then(member => {
            currentUser = member;
        })
        .catch(error => {
            console.error(error);
        });
        // get volunteer interests for current user
        preferences = await getUser(currentUser['id']).catch(error => {
            console.error(error);
        });
    } else {
        // if no user is logged in, preferences remains [], returns random set of opportunities
        $w('#Section1ListHeaderLongtext1').text = 'Log in to view a set of personalized volunteer opportunitity recommendations. If you find any of these interesting, search them up in the forum below and sign up!';
    }

    // gather all posts in the forum
    let opportunities = []
    await getAllPosts().then(posts => {
            opportunities = Object.values(posts);
        })
        .catch(error => {
            console.error(error);
        });

    // find the best opportunities given user interests
    const bestIds = rankOpportunities({preferences, opportunities});
    const bestOpps = getOppsFromIds({opportunities, bestIds});

    // display opportunities on the home page
    if (bestOpps.length == 1) {
        $w('#Section1ListItem2Title1').text = bestOpps[0].title;
        $w('#Section1ListItem2Longtext1').text = getFirst30Words(bestOpps[0].text) + '...';
        $w('#Section1ListItem1Title1').text = '';
        $w('#Section1ListItem1Longtext1').text = '';
        $w('#Section1ListItem3Title1').text = '';
        $w('#Section1ListItem3Longtext1').text = '';
    }

    if (bestOpps.length == 2) {
        $w('#Section1ListItem1Title1').text = bestOpps[0].title;
        $w('#Section1ListItem1Longtext1').text = getFirst30Words(bestOpps[0].text) + '...';
        $w('#Section1ListItem2Title1').text = '';
        $w('#Section1ListItem2Longtext1').text = 'VolunTold You is your one-stop shop for finding and sharing volunteer opportunities on or around Stanford. Scroll down to explore upcoming opportunities or post your own!';
        $w('#Section1ListItem3Title1').text = bestOpps[1].title;
        $w('#Section1ListItem3Longtext1').text = getFirst30Words(bestOpps[1].text) + '...';
    }
    
    if (bestOpps.length == 3) {
        for (let i = 0; i < bestOpps.length; i++) {
            $w('#Section1ListItem' + String(i+1) + 'Title1').text = bestOpps[i].title;
            $w('#Section1ListItem' + String(i+1) + 'Longtext1').text = getFirst30Words(bestOpps[i].text) + '...';
        }
    }
});

// get current user logged into site
async function getCurrentUser() {
    return await currentMember.getMember()
        .then((member) => {
            if (member == null) {
                return;
            } else {
                let id = member.contactId;
                return {id};
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

// get all categories of forum posts
async function getAllCategories() {
    return await wixData.query('Forum/Categories')
        .find()
        .then(results => {
            const categories = results.items.map(item => {
                return {
                    id: item._id,
                    name: item.name,
                };
            });
            return Object.values(categories);
        })
        .catch(error => {
            console.error(error);
            return {};
        });
}

// get all forum posts
async function getAllPosts() {
    let allCategories = []
    await getAllCategories().then(categories => {
            allCategories = Object.values(categories);
        })
        .catch(error => {
            console.error(error);
        });
    return await wixData.query('Forum/Posts')
        .find()
        .then(results => {
            const posts = results.items.map(item => {
                const tagId = item.categoryId;
                let element = allCategories.find(item => item.id === tagId);
                let name = element ? element.name : null;
                return {
                    id: item._id,
                    title: item.title,
                    tag: name,
                    text: item.plainContent,
                };
            });
            return posts;
        })
        .catch(error => {
            console.error(error);
            return {};
        });
}

// rank opportunities
const rankOpportunities = ({preferences, opportunities}) => {
    let numOpps = 3;
    let bestOpportunities = [];
    if (opportunities.length < 3) {
        numOpps = opportunities.length;
    }
    
    // if no opportunities fit user's preferences, return random opportunities
    let presentTags = []
    for (let a = 0; a < opportunities.length; a++) {
        let tags = [opportunities[a].tag];
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
                bestOpportunities.push(opportunities[index].id);
            }
        }
        return bestOpportunities;
    }

    // find all opportunities that match the user's preferences
    let matchingOpportunities = {};
    for (let i = 0; i < opportunities.length; i++) {
        let curOpportunity = opportunities[i];
        let key = curOpportunity.id;
        for (let j = 0; j < preferences.length; j++) {
            let tags = [curOpportunity.tag]
            if (tags.includes(preferences[j])) {
                if (!Object.prototype.hasOwnProperty.call(matchingOpportunities, key)) {
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
    let bestOpportunitiesUpdated = Object.fromEntries(bestOpportunities);
    return Object.keys(bestOpportunitiesUpdated);
}

// given opportunity ids, find corresponding opportunities
const getOppsFromIds = ({opportunities, bestIds}) => {
    let opps = [];
    for (let i = 0; i < bestIds.length; i++) {
        for (let j = 0; j < opportunities.length; j++) {
            if (opportunities[j].id === bestIds[i]) {
                opps.push(opportunities[j]);
                break;
            }
        }
    }
    return opps;
}
