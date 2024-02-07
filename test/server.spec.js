const supertest = require("supertest");

const tokens = [
  "wN6mY3262zRt0TE9ynPnmxJhEJ8G2tX2UBsDS1VTM5II10eHB28OeaoQEaUzcp_w-CDOlVcD6YdU8rDk2b-OPQ",
  "b1kZINxckg1B75mVU_HjpxCmqeLvLx4ZYpZ5c7NeXM3OILaZbYgVRqkXLWHKZ7SR3enrN1WUGnQKfoqcJBDsLQ",
];
process.env.SECURITY_TOKENS = tokens.join(",");
const app = require("../server");

const requestWithSupertest = supertest(app);

describe("Webhook Endpoint", () => {
  it("POST /webhook should accept valid order.completed event", async () => {
    const stateChangeProcessing = {
      hook: {
        id: 68,
        event: "order.completed",
        target: "https://1345-135-180-37-121.ngrok.io/webhook",
      },
      data: {
        order_id: "AAAAAAAAAmYAB3acTtZ3DS2-6EgllSFmL8O9VfY3QwtnvaG9jvw6XHOV",
      },
    };

    const res = await requestWithSupertest
      .post("/webhook")
      .set({
        "x-truework-token":
          "wN6mY3262zRt0TE9ynPnmxJhEJ8G2tX2UBsDS1VTM5II10eHB28OeaoQEaUzcp_w-CDOlVcD6YdU8rDk2b-OPQ",
      })
      .send(stateChangeProcessing);
    expect(res.status).toEqual(200);
  });

  it("POST /webhook should return 403 without a valid security token", async () => {
    const res = await requestWithSupertest.post("/webhook").send("Hello");
    expect(res.status).toEqual(403);
  });

  it("should have a GET /token endpoint", async () => {
    const res = await requestWithSupertest.get("/token");
    // TODO: mock the response from the Truework Sandbox
    expect(res.status);
  });
});
