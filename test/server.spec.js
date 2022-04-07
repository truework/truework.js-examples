const supertest = require("supertest")

const tokens = [
  "wN6mY3262zRt0TE9ynPnmxJhEJ8G2tX2UBsDS1VTM5II10eHB28OeaoQEaUzcp_w-CDOlVcD6YdU8rDk2b-OPQ",
  "b1kZINxckg1B75mVU_HjpxCmqeLvLx4ZYpZ5c7NeXM3OILaZbYgVRqkXLWHKZ7SR3enrN1WUGnQKfoqcJBDsLQ",
]
process.env.SECURITY_TOKENS = tokens.join(",")
const app = require("../server")

const requestWithSupertest = supertest(app)

describe("Webhook Endpoint", () => {
  it("POST /webhook should accept valid verification_request.state.change event", async () => {
    const stateChangeProcessing = {
      hook: {
        id: 68,
        event: "verification_request.state.change",
        target: "https://1345-135-180-37-121.ngrok.io/webhook",
      },
      data: {
        verification_request_id: "AAAAAAAAAmYAB3acTtZ3DS2-6EgllSFmL8O9VfY3QwtnvaG9jvw6XHOV",
        state: "processing",
        credentials_session_token: "FnwaBrkdPFYwqycSRv_iBrqjmKeM_fxJWzNutNZi_Fg",
      },
    }

    const res = await requestWithSupertest
      .post("/webhook")
      .set({
        "x-truework-token": "wN6mY3262zRt0TE9ynPnmxJhEJ8G2tX2UBsDS1VTM5II10eHB28OeaoQEaUzcp_w-CDOlVcD6YdU8rDk2b-OPQ",
      })
      .send(stateChangeProcessing)
    expect(res.status).toEqual(200)
  })

  it("POST /webhook should accept valid credentials_session.state.change event", async () => {
    const stateChangeProcessing = {
      hook: {
        id: 50,
        event: "credentials_session.state.change",
        target: "https://example.com/webhook",
      },
      data: {
        state: "success",
        token: "GF7UOlmqj_4X4Sui99qvjc6jA-CHEyyhmQlmJ7yIuoM",
        verification_request_id: "AAAAAAAAAZ0ABz8-Lz-DIPDFfECWdfcOh8GHJQPZGFiSmb1SyxtR2O3z",
      },
    }
    const res = await requestWithSupertest
      .post("/webhook")
      .set({
        "x-truework-token": "b1kZINxckg1B75mVU_HjpxCmqeLvLx4ZYpZ5c7NeXM3OILaZbYgVRqkXLWHKZ7SR3enrN1WUGnQKfoqcJBDsLQ",
      })
      .send(stateChangeProcessing)
    expect(res.status).toEqual(200)
  })

  it("POST /webhook should return 403 without a valid security token", async () => {
    const res = await requestWithSupertest.post("/webhook").send("Hello")
    expect(res.status).toEqual(403)
  })

  it("should have a GET /token endpoint", async () => {
    const res = await requestWithSupertest.get("/token")
    // TODO: mock the response from the Truework Sandbox
    expect(res.status)
  })
})
