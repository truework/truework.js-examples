#! /usr/bin/env node

const path = require('path');
const express = require('express');

const app = express();
const fetch = require('node-fetch');
require('dotenv').config();

const TOKEN = process.env.TW_SANDBOX_API_TOKEN;

if (!process.env.SECURITY_TOKEN) { throw Error('Security token must be defined'); }

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
      },
    );

    res.json(await response.json());
  });

app.post('/webhook', jsonParser, async (req, res) => {
  if (
    // Verify that there's a security token provided
    // so we don't accept or interpret out of band requests.
    process.env.SECURITY_TOKEN.split(',').includes(req.get('x-truework-token'))
  ) {
    console.log(`Received webhook\n${JSON.stringify(req.body, null, 2)}`);
    if (req.body.data.state === 'completed') {
      // if the verification is completed, get the data from the api
      const verificationRequestId = req.body.data.verification_request_id;
      const response = await fetch(
        `https://api.truework-sandbox.com/verification-requests/${verificationRequestId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(
        `Note: Verification Data from Truework (not from webhook):\n${JSON.stringify(await response.json(), null, 2)}`,
      );
      res.send();
    } else {
      res.send();
    }
  } else {
    console.log(
      `Rejected webhook without valid request_id. Body: ${JSON.stringify(
        req.body,
      )}`,
    );
    res.status(403).send();
  }
});

module.exports = app;
