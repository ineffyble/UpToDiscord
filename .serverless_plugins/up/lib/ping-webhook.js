'use strict';
const BPromise = require('bluebird');

const upClient = require('../../../up');
const UP_API_WEBHOOKS_PATH = `webhooks`

module.exports = {
  pingWebhook () {
    const webhook = this.variables.webhook;
    if (!webhook) {
      this.logger.log("ERROR: No Up webhook found - try running 'sls deploy' or 'up:register'");
      return BPromise.reject();
    }
    upClient.post(`${UP_API_WEBHOOKS_PATH}/${webhook["id"]}/ping`).then(({ body: result }) => {
      this.logger.log('Pinged Up webhook - check Discord for a notification');
      return BPromise.resolve();
    });
  }
}