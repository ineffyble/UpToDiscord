# UpToDiscord

**UpToDiscord** automatically posts new Up transactions to a designated Discord channel.

## Important

This is provided with no guarantees. It should not be considered production-ready.

It stores secrets, including secrets that could give an attacker full access your private information, in AWS Lambda environment variables. While these are encrypted, it is not best practice.

It also does not verify webhook payloads from Up as per their recommended practice.

It does not have any reliability beyond that which Up implement.

Running `sls remove` or deleting the CloudFormation stack will not delete the automatically created Up webhook,
that must be done manually.

## Installation

1. Clone the repo:

```sh
git clone git@github.com:ineffyble/UptoDiscord.git
cd UpToDiscord
```

2. Install dependencies:

```sh
yarn
```

## Deployment

1. Ensure you have an AWS account set up and configured on your dev environment.
2. Create an [Up Personal Access Token](https://api.up.com.au)
3. Create a [Discord webhook URL](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) and extract
the webhook ID (first part of the webhook URL after `https://discordapp.com/api/webhooks/`) and webhook secret (next part of the URL).
4. Export environment variables:
```sh
export UP_API_KEY=up:yeah:xxx
export DISCORD_WEBHOOK_ID=1234
export DISCORD_WEBHOOK_SECRET=abcd
```
5. Deploy with Serverless Framework:
```sh
sls deploy
```

Deployment will automatically:
* Create an AWS Lambda function with the source code of this project
* Create an AWS API Gateway endpoint connected to that Lambda
* Create an Up webhook pointing at the AWS API Gateway endpoint (via custom plugin)
* Make a webhook "ping" request to Up to confirm that UpToDiscord is working (you should see a new Discord message)

## Development

You can run the lambda function locally by running:

```sh
sls offline
```

Details of the Up Banking API specification and webhook format [are available at developer.up.com.au](https://developer.up.com.au).

Details of the Discord.js library [are available at discordjs.guide](https://discordjs.guide/).

Contributions are very welcome.