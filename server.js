#! /usr/bin/env node

const path = require('path');
const express = require('express');
const app = express();
const fetch = require('node-fetch');

const { TW_SANDBOX_API_TOKEN: TOKEN } = process.env;

const jsonParser = express.json();
app
  .use(express.static(path.join(__dirname, 'static')))
  .get('/token', async (req, res) => {
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
  console.log(req.body);
  if (
    req.body.hook.event === 'verification_request.state.change' &&
    req.body.data.state === 'completed'
  ) {
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
    console.log(await response.json());
    res.send();
  } else if (
    req.body.hook.event === 'verification_request.state.change'
  ) {
    res.send();
  } else {
    res.status(500).send();
  }
});

module.exports = app;
