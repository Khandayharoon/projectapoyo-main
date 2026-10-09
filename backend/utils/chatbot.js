require('dotenv').config();
const fs = require('fs');
const path = require('path');
const random = require('random');
const axios = require('axios');
const { search } = require('fast-fuzzy');

const apiKey = process.env.API_KEY;
const azureEndpoint = "https://aasare-new.openai.azure.com/";
const apiVersion = "2024-02-15-preview";

// Read topics from a file
const readTopicsFromFile = (filePath) => {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return fileData.split('\n').map(topic => topic.trim().toLowerCase());
};

// Read blog links from a file
const readBlogLinksFromFile = (filePath) => {
    const blogs = {};
    const fileData = fs.readFileSync(filePath, 'utf-8');
    fileData.split('\n').forEach(line => {
        const [topic, links] = line.split('|');
        blogs[topic.trim().toLowerCase()] = links.split(',').map(link => link.trim()).filter(Boolean);
    });
    return blogs;
};

// Correct spelling of a question based on available topics
const correctSpelling = (question, topics) => {
    const words = question.split(' ');
    const correctedWords = words.map(word => {
        const { bestMatch, bestMatchIndex } = search(word, topics);
        
		console.log("bestMatch: ", bestMatch);
		return "health"
		//return bestMatchIndex !== -1 && bestMatch.rating > 0.6 ? bestMatch.target : word;
    });
    return correctedWords.join(' ');
};

// Get related topic from the question
const getRelatedTopic = (question, topics) => {
    const questionLower = question.toLowerCase();
    return topics.find(topic => questionLower.includes(topic)) || null;
};

// Select a random blog link for a given topic
const selectRandomBlogLink = (topic, blogs) => {
    if (blogs[topic]) {
        const links = blogs[topic];
        return links[random.int(0, links.length - 1)];
    }
    return null;
};

const topicsFilePath = path.join(__dirname, 'topics.txt');
const blogsFilePath = path.join(__dirname, 'blogs.txt');

const topics = readTopicsFromFile(topicsFilePath);
const blogs = readBlogLinksFromFile(blogsFilePath);

const getResponse = async (question) => {
    const headers = {
        'Content-Type': 'application/json',
        'api-key': apiKey
    };

    const data = {
        "model": "aasare-new",
        "messages": [
            { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": question }
        ]
    };

    try {
        const response = await axios.post(`${azureEndpoint}openai/deployments/aasare-35/chat/completions?api-version=${apiVersion}`, data, { headers });
        if (response.status === 200) {
            return response.data.choices[0].message.content;
        } else {
            return null;
        }
    } catch (error) {
        //console.error("Error fetching response:", error);
        return null;
    }
};

const chatbotResponse = async (question) => {
    const correctedQuestion = correctSpelling(question, topics);
    const relatedTopic = getRelatedTopic(correctedQuestion, topics);
    const response = await getResponse(relatedTopic);

    if (relatedTopic) {
        return {
            response: response
        };
    } else {
        return {
            response: "It's not related to mental health."
        };
    }
};

module.exports = { chatbotResponse };
