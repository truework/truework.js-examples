require("dotenv").config()
require('cross-fetch/polyfill');

const path = require("path")
const express = require("express")
const { gretch } = require('gretchen')

const app = express()
const API_BASE_URL = 'https://api.truework-sandbox.com'
const { TW_SANDBOX_API_TOKEN, SECURITY_TOKENS } = process.env

if (!process.env.SECURITY_TOKENS) {
  throw Error("Env 'SECURITY_TOKENS' must be defined")
}

const WEBHOOK_TOKENS_ARRAY = SECURITY_TOKENS.split(',')

app.use(express.static(path.join(__dirname, "static")))
app.use(express.json())

app.get("/token", async (req, res) => {
  const USER_PAYLOAD = {
    type: "employment",
    permissible_purpose: "credit-application",
    use_case: "mortgage",
    target: {
      first_name: "Jane",
      last_name: "Doe",
      social_security_number: "000-20-0000",
      contact_email: "jane@example.com",
      date_of_birth: "2020-02-02",
      company: {
        name: "Acme Inc",
      },
    },
  }

  const { data, error, status, response } = await gretch(`${API_BASE_URL}/credentials/session`, {
    method: "POST",
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${TW_SANDBOX_API_TOKEN}`,
    },
    json: USER_PAYLOAD,
  }).json()

  if (!response.ok) {
    console.error(`${status} error when creating session:\n${JSON.stringify(error, null, 2)}`)
    return res.status(500).json({ message: "Error creating session" })
  }

  console.info(`Session created:\n${JSON.stringify(data, null, 2)}`)

  res.json(data).send()
})

app.post("/webhook", async (req, res) => {
  const WEBHOOK_TOKEN = req.get("x-truework-token")

  /*
   * Verify that there's a security token provided so we don't accept or
   * interpret out of band requests.
   */
  if (!WEBHOOK_TOKENS_ARRAY.includes(WEBHOOK_TOKEN)) {
    console.warn(`Rejected webhook without valid token:\n${JSON.stringify(req.body, null, 2)}`)
    return res.status(403).send()
  }

  /*
   * Otherwise ACK immediately
   */
  res.send()

  console.info(`Received webhook:\n${JSON.stringify(req.body, null, 2)}`)

  /*
   * If the verification is completed, get the data from the api
   */
  if (req.body.hook.event === "verification_request.state.change" && req.body.data.state === "completed") {
    const id = req.body.data.verification_request_id
    const { status, data, error, response } = await gretch(`${API_BASE_URL}/verification-requests/${id}`, {
      headers: {
        Authorization: `Bearer ${TW_SANDBOX_API_TOKEN}`,
        Accept: "application/json; version=2020-12-07",
      },
    }).json()

    if (!response.ok || !data) {
      console.error(`${status} error when fetching verification:\n${JSON.stringify(error, null, 2)}`)
    } else if (data) {
      console.info(`Received verification data:\n${JSON.stringify(data, null, 2)}`)
    }
  }
})

module.exports = app
