const app = require('../server.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);
const fetch = require('node-fetch');

// TODO: For tests, ensure env SECURITY_TOKEN=FnwaBrkdPFYwqycSRv_iBrqjmKeM_fxJWzNutNZi_Fg

describe('Webhook Endpoint', () => {
  it('POST /webhook should show all users', async () => {
    const state_change_processing = {
      hook: {
        id: 68,
        event: 'verification_request.state.change',
        target: 'https://1345-135-180-37-121.ngrok.io/webhook',
      },
      data: {
        verification_request_id:
          'AAAAAAAAAmYAB3acTtZ3DS2-6EgllSFmL8O9VfY3QwtnvaG9jvw6XHOV',
        state: 'processing',
        credentials_session_token:
          'FnwaBrkdPFYwqycSRv_iBrqjmKeM_fxJWzNutNZi_Fg',
      },
    };

    const res = await requestWithSupertest
      .post('/webhook')
      .send(state_change_processing);
    expect(res.status).toEqual(200);
  });

  it('POST /webhook should return 403 without a valid security token', async () => {
    const res = await requestWithSupertest.post('/webhook').send('Hello');
    expect(res.status).toEqual(403);
  });

	it('should have a GET /token endpoint', async () => {
    const res = await requestWithSupertest.get('/token');
    expect(res.status).toEqual(200);
  });

});

