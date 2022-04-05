#! /usr/bin/env node

const path = require('path');
const express = require('express');

const app = express();
const fetch = require('node-fetch');
require('dotenv').config();

const TOKEN = process.env.TW_SANDBOX_API_TOKEN;

if (!process.env.SECURITY_TOKENS) {
  throw Error('Security token must be defined');
}

const USER_PAYLOAD = {
  type: 'employment',
  permissible_purpose: 'credit-application',
  use_case: 'mortgage',
  target: {
    first_name: 'Jane',
    last_name: 'Doe',
    social_security_number: '000-20-0000',
    contact_email: 'user@example.com',
    date_of_birth: '2020-02-02',
    company: {
      name: 'Acme Inc',
    },
  },
}

const jsonParser = express.json();
app
  .use(express.static(path.join(__dirname, 'static')))
  .get('/token', async (req, res) => {
    const response = await fetch(
      'https://api.truework.com/credentials/session',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(USER_PAYLOAD),
      }
    );
    console.info(`Session Creation Response:`);
    console.dir(response, null, 2, true);
    if (!response.status === 200) {
      res.status(500).json({ message: 'Error creating session' });
      return;
    }
    return res.json(await response.json()).send();
  });

app.post('/webhook', jsonParser, async (req, res) => {
  if (
    !process.env.SECURITY_TOKENS.split(',').includes(
      req.get('x-truework-token')
    )
  ) {
    // Verify that there's a security token provided
    // so we don't accept or interpret out of band requests.
    console.warn(
      `Rejected webhook without valid token. Body: ${JSON.stringify(req.body)}`
    );
    return res.status(403).send();
  }
  res.send();

  console.info(`Received webhook:\n${JSON.stringify(req.body, null, 2)}`);
  let verificationRequestId = '';

  if (
    req.body.hook.event === 'credentials_session.state.change' &&
    req.body.data.state === 'success'
  ) {
    verificationRequestId = req.body.data.verification_request_id;
  }

  if (
    req.body.hook.event === 'verification_request.state.change' &&
    req.body.data.state === 'completed'
  ) {
    verificationRequestId = req.body.data.verification_request_id;
  }
  // if the verification is completed, get the data from the api
  if (verificationRequestId !== '') {
    const response = await fetch(
      `https://api.truework.com/verification-requests/${verificationRequestId}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: 'application/json; version=2020-12-07',
        },
      }
    );
    if (!response.status === 200) {
      return console.log(response.status, response.statusText, response.url);
    }
    const data = await response.json();
    console.info(
      `Received verification request data:\n${JSON.stringify(data, null, 2)}`
    );
  }

  return;
});

module.exports = app;
