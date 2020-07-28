const got = require('got');

const UP_API_KEY = process.env.UP_API_KEY;
const UP_API_BASE = 'https://api.up.com.au/api/v1';

const upClient = got.extend({
  prefixUrl: UP_API_BASE,
  headers: {
    Authorization: `Bearer ${UP_API_KEY}`
  }
});

module.exports = upClient;