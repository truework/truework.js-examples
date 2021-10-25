# Truework.js Credentials

A basic example of a [Truework.js
Credentials](https://www.truework.com/docs/getting-started/truework-js-tutorial)
implementaion using Node.js and browser APIs.

This example has two components:

1. An Express server that servers static content, securely creates Credentials
   Sessions, and listens for webhooks
2. A simple static HTML file that implements the Truework.js Credentials widget

## Getting Started

To get started, first install dependencies:

```bash
npm ci
```

Then, either add your Sandbox [API
token](https://www.truework.com/docs/getting-started/api-keys) to the `.env`, or
pass as an environment variable when running `npm start`.

## Deploy Locally

To run the server on port `5000`:

```bash
npm start
```

Then open `http://localhost:5000` in a web browser.

## Webhooks

The Express server is configured to listen for
[webhooks](https://www.truework.com/docs/getting-started/webhooks) on the
`/webhook` endpoint. You should use a tunneling service like [ngrok](https://www.ngrok.com/) to make
this endpoint reachable by Truework.com for testing:

```bash
npm start

server running on http://localhost:5000, https://4c95-173-195-79-50.ngrok.io
```

Then, configure Truework to call the publicly reachable webhook address e.g.
`http://4c95-173-195-79-50.ngrok.io/webhook`

For webhooks to be secure, ensure that you copy the 'token' key to the `SECURITY_TOKEN` environment variable, so you validate each request came from the TrueworkAPIs.
