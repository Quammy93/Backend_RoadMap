#!/usr/bin/env node

const https = require('https');

function fetchGitHubActivity(username) {
    const url = `https://api.github.com/users/${username}/events`;

    const options = {
        headers: {
            'User-Agent': 'nodejs' // GitHub API requires a User-Agent header
        }
    };

    https.get(url, options, (res) => {
        let data = '';

        // A chunk of data has been received.
        res.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        res.on('end', () => {
            // Check for rate limit error
            if (res.statusCode === 403) {
                console.error('Error: Rate limit exceeded. Please try again later.');
                return;
            }

            // Handle invalid username (404 status code)
            if (res.statusCode === 404) {
                console.error('Error: User not found.');
                return;
            }

            // Handle general success response
            if (res.statusCode === 200) {
                try {
                    const activities = JSON.parse(data);

                    if (activities.length === 0) {
                        console.log('No recent activities found.');
                    } else {
                        activities.forEach(activity => {
                            if (activity.type === 'PushEvent') {
                                console.log(`Pushed ${activity.payload.size} commits to ${activity.repo.name}`);
                            } else if (activity.type === 'IssuesEvent' && activity.payload.action === 'opened') {
                                console.log(`Opened a new issue in ${activity.repo.name}`);
                            } else if (activity.type === 'WatchEvent' && activity.payload.action === 'starred') {
                                console.log(`Starred ${activity.repo.name}`);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error parsing the response:', error);
                }
            } else {
                console.error(`Error: Received status code ${res.statusCode}`);
            }
        });

    }).on('error', (e) => {
        console.error(`Network error: ${e.message}`);
    });
}

// Call the function with a username
const username = process.argv[2]; // Get the username from the command line arguments
if (!username) {
    console.error('Please provide a GitHub username.');
    process.exit(1); // Exit if no username is provided
}

fetchGitHubActivity(username);

