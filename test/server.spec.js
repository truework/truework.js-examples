const app = require('../server.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(app);

describe('Webhook Endpoint', () => {
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
      credentials_session_token: 'FnwaBrkdPFYwqycSRv_iBrqjmKeM_fxJWzNutNZi_Fg',
    },
  };

  it('POST /webhook should show all users', async () => {
    const res = await requestWithSupertest
      .post('/webhook')
      .send(state_change_processing);
    expect(res.status).toEqual(200);
  });
});

// const state_change_completed = {
//   hook: {
//     id: 68,
//     event: 'verification_request.state.change',
//     target: 'https://1345-135-180-37-121.ngrok.io/webhook',
//   },
//   data: {
//     verification_request_id:
//       'AAAAAAAAAmYAB3acTtZ3DS2-6EgllSFmL8O9VfY3QwtnvaG9jvw6XHOV',
//     state: 'completed',
//     credentials_session_token: 'FnwaBrkdPFYwqycSRv_iBrqjmKeM_fxJWzNutNZi_Fg',
//   },
// };
// const verification = {
//   id: 'AAAAAAAAAmYAB3acTtZ3DS2-6EgllSFmL8O9VfY3QwtnvaG9jvw6XHOV',
//   loan_id: null,
//   state: 'completed',
//   price: { currency: 'USD', amount: '34.95' },
//   turnaround_time: {
//     lower_bound: '20',
//     upper_bound: '124',
//     best_estimate: '48',
//   },
//   created: '2021-10-22T21:07:17.501388Z',
//   date_of_completion: '2021-10-22T21:07:20.707917Z',
//   target: {
//     first_name: 'Eric',
//     last_name: 'Bailey',
//     contact_email: 'eric@truework.com',
//     social_security_number: '***-**-1234',
//     company: { id: 1, name: 'Truework - DEMO' },
//     date_of_birth: '2020-02-02',
//   },
//   permissible_purpose: 'credit-application',
//   type: 'employment',
//   reports: [
//     {
//       id: 'AAAAAAAAAaEAC8_Uu4YwhVvbccnXFBVmE_ST2dQsxLq5wa4hSfH4cVAK',
//       created: '2021-10-22T21:07:20.385360Z',
//       current_as_of: '2021-10-22',
//       verification_request: [Object],
//       employer: [Object],
//       employee: [Object],
//       additional_notes: '',
//     },
//   ],
//   use_case: 'preapproval',
// };
