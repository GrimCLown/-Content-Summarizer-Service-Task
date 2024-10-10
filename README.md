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
name = "url-summarization-service"
type = "javascript"
account_id = "your-cloudflare-account-id"
workers_dev = true
compatibility_date = "2024-10-10"

[env.dev]
vars = { OPENAI_API_KEY = "$OPENAI_API_KEY" }
```
Run the development server locally using:

```bash
npx wrangler dev
```

## Deployment to Cloudflare Workers
After testing locally, you can deploy the function to Cloudflare Workers:
Make sure you're authenticated with Cloudflare. Run:
```bash
wrangler login
```
Deploy the Worker by running:
```bash
wrangler publish
```
This will deploy the project to your Cloudflare account, and you'll get a unique URL for your Worker.

## Usage

This function expects a POST request with a JSON body containing the following fields:
- url (string): The URL from which to fetch and summarize content.
- preferences (object)
  - wordCount (integer): The maximum number of words for the summary.
  - style (string): The desired style of the summary (e.g., formal, casual, etc.).
 
### Testing the API Using Postman

## Open Postman
Make sure you have Postman installed on your machine. You can download it from Postman's official website.

## Create a New Request
Open Postman and click the "New" button.
Select "HTTP Request".

## Configure the Request
-  Set the HTTP method to POST.
-  URL: Set the request URL to either your local or deployed endpoint:
  	- For local testing: http://127.0.0.1:8787
		- For deployed Cloudflare Worker: https://your-worker-url.workers.dev
## Set Up Headers
In the Headers tab, add the following header:
```bash
Key: Content-Type
Value: application/json
```
## Add the Request Body
In the Body tab, select raw and set the format to JSON.

Here's an example of what your JSON request body might look like:
```bash
{
  "url": "https://example.com",
  "preferences": {
    "wordCount": 100,
    "style": "formal"
  }
}
```
- url: The URL from which to extract and summarize content.
- preferences.wordCount: The desired maximum word count for the summary.
- preferences.style: The style of the summary, such as "formal," "casual," etc.
## Send the Request
Click the "Send" button to send the request to your local server or deployed Cloudflare Worker.
## View the Response
Once the request is processed, Postman will display the response in the Body section.

A successful response might look like this:
```bash
{
  "summary": "This is a summarized version of the content from the provided URL."
}
```
If there are any errors, the response will include details like this:
```bash
{
  "error": "Invalid URL",
  "message": "The URL provided is either missing or not in a valid format. Please check the URL and try again."
}
```
