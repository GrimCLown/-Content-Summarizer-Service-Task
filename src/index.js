import OpenAI from 'openai';
import * as cheerio from 'cheerio';

export default {
	async fetch(request, env, ctx) {
		try {
			// Initialize OpenAI with API key
			const openai = new OpenAI({
				apiKey: env.OPENAI_API_KEY,
			});

			// Parse the request body to get the URL and preferences
			const { url, preferences } = await request.json();

			// Validate the URL
			if (!url || !isValidURL(url)) {
				return new Response(
					JSON.stringify({
						error: 'Invalid URL',
						message: 'The URL provided is either missing or not in a valid format. Please check the URL and try again.',
					}),
					{ status: 400, headers: { 'Content-Type': 'application/json' } }
				);
			}

			// Validate preferences
			if (!preferences || !preferences.wordCount || !preferences.style) {
				return new Response(
					JSON.stringify({
						error: 'Invalid preferences',
						message:
							'Please provide valid preferences including both "wordCount" and "style". These are required for summarizing the text.',
					}),
					{ status: 400, headers: { 'Content-Type': 'application/json' } }
				);
			}

			// Fetch the HTML content from the provided URL
			const response = await fetch(url);
			if (!response.ok) {
				return new Response(
					JSON.stringify({
						error: 'Content retrieval failed',
						message: `Failed to fetch content from the provided URL. The server responded with status code: ${response.status}. Please check the URL and try again.`,
					}),
					{ status: response.status, headers: { 'Content-Type': 'application/json' } }
				);
			}

			// Extract plain text from HTML content
			const html = await response.text();
			const plainText = extractContent(html);

			// If no content is extracted
			if (!plainText.trim()) {
				return new Response(
					JSON.stringify({
						error: 'No content found',
						message: 'The provided URL does not contain any extractable content. Please check the URL for actual content and try again.',
					}),
					{ status: 400, headers: { 'Content-Type': 'application/json' } }
				);
			}

			// Use OpenAI to summarize the extracted text
			const summary = await summarizeText(plainText, preferences, openai);

			// Return the summary in JSON format
			return new Response(JSON.stringify({ summary }), { status: 200, headers: { 'Content-Type': 'application/json' } });
		} catch (error) {
			// Handle unexpected errors or OpenAI API failures
			return new Response(
				JSON.stringify({
					error: 'Internal Server Error',
					message: 'An unexpected error occurred. Please try again later.',
					details: error.message,
				}),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}
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
	try {
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
			model: 'gpt-3.5-turbo',
			messages: messages,
		});

		// Extract the summary from the assistant's response
		const assistantMessage = chatCompletion.choices[0].message.content;

		return assistantMessage;
	} catch (error) {
		// Handle OpenAI API errors specifically
		throw new Error('OpenAI API error: ' + error.message);
	}
}
