# URL Summarization Service

This Cloudflare Worker script fetches content from a provided URL, extracts the plain text using \`cheerio\`, and uses the OpenAI API to summarize the content based on user preferences such as word count and style.

## Features

- Fetches HTML content from a URL.
- Validates the URL and user preferences.
- Extracts plain text from HTML using \`cheerio\`.
- Summarizes the extracted text using the OpenAI API based on user-defined preferences like word count and style.
- Handles common errors such as invalid URLs, missing preferences, content retrieval failure, and API errors.

## Technologies Used

- OpenAI: For summarizing text using the GPT-3.5-turbo model.
- Cheerio: For parsing and extracting plain text from HTML content.
- JavaScript: For building the serverless function logic.
- Cloudflare Workers: Serverless deployment (environment variable used for the OpenAI API key).

## Installation & Setup

## Prerequisites

- [Node.js](https://nodejs.org/en/) installed on your system.
- Cloudflare Workers CLI tool [Wrangler](https://developers.cloudflare.com/workers/wrangler/get-started/) installed.
- OpenAI API key to access the GPT-3.5-turbo model.

## Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/GrimCLown/-Content-Summarizer-Service-Task.git
cd -Content-Summarizer-Service-Task
```

### Install dependencies:

```bash
npm install
```

## Set Up Environment Variables
Create a .dev.vars file and add your OpenAI API key:
```bash
OPENAI_API_KEY=your-openai-api-key
```

## Running Locally
To test the function locally, use Wrangler to simulate Cloudflare Workers. Wrangler automatically reads environment variables from .dev.vars.

Make sure your Wrangler CLI is installed. If not, you can install it by running:
```bash
npm install -g wrangler
```
Ensure your wrangler.toml is configured correctly. You can use the following basic structure in your wrangler.toml:
```bash
npx wrangler dev
```

## Deployment to Cloudflare Workers
After testing locally, you can deploy the function to Cloudflare Workers:
Make sure you're authenticated with Cloudflare. Run:
```bash
npx wrangler login
```
Add the Secret Key: You can add a secret key by running the following command:
```bash
npx wrangler secret put OPENAI_API_KEY
```
Deploy the Worker by running:
```bash
npx wrangler publish
```
This will deploy the project to your Cloudflare account, and you'll get a unique URL for your Worker.

## Usage
This function expects a POST request with a JSON body containing the following fields:
- url (string): The URL from which to fetch and summarize content.
- preferences (object)
  - wordCount (integer): The maximum number of words for the summary.
  - style (string): The desired style of the summary (e.g., formal, casual, etc.).
 
### Testing the URL Summarization Service with Postman
Once you have the service running locally or deployed on Cloudflare Workers, you can test the API using Postman to ensure that it's functioning as expected. Here's how to test the service:

## Step 1: Open Postman
Install Postman from the official website if you haven't already.
Open Postman on your system.

## Step 2: Set Up a New Request
Click New and select HTTP Request to create a new request.
Select the POST method, as this API typically requires sending a URL and preferences in the body of the request.
In the Request URL field, enter the local or deployed URL for your Cloudflare Worker API. For example:
If testing locally with Wrangler: http://localhost:8787/summarize
If deployed on Cloudflare: https://<your-worker-name>.workers.dev/summarize

## Step 3: Configure Request Headers
Under the Headers tab, ensure the following header is added:
Content-Type: application/json

## Step 4: Set Up the Request Body
Switch to the Body tab.

Choose raw and set the format to JSON.

Add the following JSON structure to send the necessary data to the API:
```bash
{
  "url": "https://example.com",
  "preferences": {
    "wordCount": 150,
    "style": "concise"
  }
}
```
url: The URL of the content you want to summarize (replace with the actual URL you are testing).
wordCount: The preferred word count for the summary.
style: The style of the summary (e.g., concise, detailed, casual, etc.).

## Step 5: Send the Request
Once you’ve configured the headers and body, click Send to execute the request.
Postman will send the data to your Cloudflare Worker, which will fetch the content from the specified URL, extract the plain text using Cheerio, and summarize it using the OpenAI API based on your preferences.

## Step 6: Review the Response
In the Response section of Postman, you should see the summarized text returned by your Cloudflare Worker.
The response will look something like this:
```bash
{
  "summary": "This is a concise summary of the content from the provided URL."
}
```
If there are any issues, such as an invalid URL or API error, you will see an error message in the response:

```bash
{
  "error": "Invalid URL or content retrieval failure."
}
```

## Step 7: Testing Error Handling
You can also test the error-handling mechanisms by providing incorrect or missing data, such as:

Invalid URL formats.
Missing preferences (e.g., wordCount or style).
Unreachable URLs.
The expected responses should include relevant error messages, such as:

```bash
{
  "error": "Please provide a valid URL."
}
```

