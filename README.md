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

## Step 1: Clone the Repository

Clone this repository to your local machine:

```bash
  git clone https://github.com/yourusername/project-name.git
  cd project-name
```

### 2. Install dependencies:

```bash
npm install
```

## Step 3: Set Up Environment Variables

Create a .dev.vars file and add your OpenAI API key:

```bash
OPENAI_API_KEY=your-openai-api-key
```

## Step 4: Running the Serverless Function

To test the function locally, use any serverless framework or tool like wrangler (for Cloudflare Workers). If you're using wrangler, configure your wrangler.toml with your Cloudflare credentials and run the following command:

```bash
wrangler dev
```

## Usage

This function expects a POST request with a JSON body containing the following fields:

- url (string): The URL from which to fetch and summarize content.
- preferences (object)
  - wordCount (integer): The maximum number of words for the summary.
  - style (string): The desired style of the summary (e.g., formal, casual, etc.).

## Sample Request

```bash
{
 "url": "https://example.com",
 "preferences": {
   "wordCount": 100,
   "style": "formal"
 }
}
```

## Sample Request

```bash
{
 "summary": "This is a summarized version of the content from the provided URL."
}
```

## Sample Request

- Invalid URL: If the provided URL is missing or malformed, a 400 status code with a descriptive error message is returned.
- Invalid Preferences: If preferences such as word count or style are not provided, a 400 status code is returned.
- Content Retrieval Failure: If content cannot be fetched from the provided URL, the appropriate status code and message are returned.
- Internal Server Error: If any unexpected error occurs, a 500 status code is returned along with details about the error.

## Deployment

Deploy the function using a serverless framework like Cloudflare Workers or AWS Lambda, depending on your preferred environment.
Deploy the function using a serverless framework like Cloudflare Workers or AWS Lambda, depending on your preferred environment.

```bash
wrangler publish
```
