'use strict';
const BPromise = require('bluebird');

module.exports = {
  getEndpoint() {
    return this.provider.request('CloudFormation', 'describeStacks', {StackName: this.provider.naming.getStackName(this.stage)}).then((result) => {
      let outputs = result.Stacks[0].Outputs;
      let endpointOutput = outputs.find((o) => o.OutputKey == 'ServiceEndpoint');
      let serviceEndpoint = endpointOutput.OutputValue;
      let lambdaEndpoint = `${serviceEndpoint}/webhook`;
      this.variables.endpoint = lambdaEndpoint;
    });
  }
}