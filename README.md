# Truework.js Credentials

A basic example of a [Truework.js
Credentials](https://www.truework.com/docs/getting-started/truework-js-tutorial)
implementation using Node.js and browser APIs.

This example has two components:

1. An Express server for securely creating Credentials Sessions, listening for
   webhooks, and serving static content
2. A simple static HTML file that implements the Truework.js Credentials widget

## Getting Started

To get started, first install dependencies:

```bash
npm ci
```

1. Open `static/index.html` and enter in your publishable key from your [Truework user settings page](https://www.truework.com/docs/getting-started/api-keys).
2. Configure two environment variables.
   - `TW_SANDBOX_API_TOKEN` — an API key created on your [Truework user settings page](https://www.truework.com/docs/getting-started/api-keys)
   - `SECURITY_TOKENS` — tokens generated for you when you configure a webhook in your Truework user settings. Separate these with a single comma.

Environment variables can be set by copying `.env.example` to `.env` and
defining the values there, or by passing them to the `npm start` command e.g.
`TW_SANDBOX_API_TOKEN=... npm start`.

## Running the server

To run the server on port `3000`:

```bash
npm start
```

Then open `http://localhost:3000` in a web browser.

## Webhooks

The Express server is configured to listen for
[webhooks](https://www.truework.com/docs/getting-started/webhooks) on the
`/webhook` endpoint. You should use a tunneling service like
[ngrok](https://www.ngrok.com/) to make this endpoint reachable by the Truework
API for testing:

For example, after running `npm start`, point `ngrok` at port `3000`:

```bash
ngrok http 3000
```

Then, from your Truework user Developer Settings page, configure webhooks to call the
publicly reachable address `ngrok` created for you. It should look something like
`http://4c95-173-195-79-50.ngrok.io/webhook`.

Each webhook has its own security token. Configure these values as your
`SECURITY_TOKENS` environment variable, separated by commas. This will validate
each webhook request, ensuring that it orignated from our APIs.
