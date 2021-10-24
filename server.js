#! /usr/bin/env node

const path = require('path');
const express = require('express');
const app = express();
const fetch = require('node-fetch');
require('dotenv').config();

const TOKEN = process.env.TW_SANDBOX_API_TOKEN;

const jsonParser = express.json();
app
  .use(express.static(path.join(__dirname, 'static')))
  .get('/token', async (req, res) => {
    // What is this endpoint for?
    const response = await fetch(
      'https://api.truework-sandbox.com/credentials/session',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'employment',
          permissible_purpose: 'credit-application',
          use_case: 'mortgage',
          target: {
            first_name: 'Eric',
            last_name: 'Bailey',
            social_security_number: '000001234',
            contact_email: 'eric@truework.com',
            date_of_birth: '2020-02-02',
            company: {
              name: 'Truework',
            },
          },
        }),
      }
    );

    res.json(await response.json());
  });

app.post('/webhook', jsonParser, async (req, res) => {
  if (
    req.body.data?.credentials_session_token ??
    undefined === process.env.SECURITY_TOKEN
  ) {
    if (req.body.data.state === 'completed') {
      // if the verification is completed, get the data from the api
      const verification_request_id = req.body.data.verification_request_id;
      const response = await fetch(
        `https://api.truework-sandbox.com/verification-requests/${verification_request_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(
        `VERIFICATION DATA FROM TRUEWORK - Not from webhook/n${await response.json()}`
      );
      res.send();
    } else {
      res.send();
    }
  }
  console.log(`Rejected webhook without valid request_id. Body: ${JSON.stringify(req.body)}`);
  res.status(403).send();
});

module.exports = app;
