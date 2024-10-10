import OpenAI from 'openai';
import * as cheerio from 'cheerio';

export default {
	async fetch(request, env, ctx) {
		const openai = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
		});

		// Extract the URL and preferences from the request
		const { url, preferences } = await request.json();

		if (!url || !isValidURL(url)) {
			return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400 });
		}

		// Fetch the HTML content from the provided URL
		const response = await fetch(url);
		if (!response.ok) {
			return new Response(JSON.stringify({ error: 'Failed to fetch content from the URL' }), { status: 400 });
		}

		// Get the HTML text from the response
		const html = await response.text();

		// Use Cheerio to load the HTML and extract the plain text
		const plainText = extractContent(html);

		// Use the plainText to create a summary based on the user's preferences
		const summary = await summarizeText(plainText, preferences, openai);

		return new Response(JSON.stringify({ summary }), { status: 200 });
	},
};

// Function to check if the provided URL is valid
function isValidURL(url) {
	const regex = new RegExp(
		'^(https?:\\/\\/)?' +
			'((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' +
			'(\\?[;&a-zA-Z\\d%_.~+=-]*)?' +
			'(\\#[-a-zA-Z\\d_]*)?$'
	);
	return regex.test(url);
}

// Function to extract plain text from the HTML using Cheerio
function extractContent(html) {
	const $ = cheerio.load(html);
	return $('body').text(); // Extracts the text content from the body of the HTML
}

// Function to summarize the extracted plain text using OpenAI
async function summarizeText(plainText, preferences, openai) {
	// Prepare the messages for the OpenAI chat model
	const messages = [
		{
			role: 'system',
			content: `You are a summarization assistant. Summarize text to a maximum word count, with a specific style, and highlight key points.`,
		},
		{
			role: 'user',
			content: `Summarize the following text to ${preferences.wordCount} words in an ${preferences.style} style: ${plainText}`,
		},
	];

	// Call the OpenAI API to create a summary
	const chatCompletion = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: messages,
	});

	// Extract the summary from the assistant's response
	const assistantMessage = chatCompletion.choices[0].message.content;

	return assistantMessage;
}
