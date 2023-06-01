# rampart-api

Backend application for the Rampart AI Hackathon team.

## Build the application

1. Clone the repository:

   ```sh
   git clone https://github.com/manjunathsubra/rampart-api.git
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

## Start as non-serverless application locally

```
SERVERLESS_DEPLOYMENT=false OPEN_AI_KEY={OPEN_AI_KEY} npm run start
```

## Start as serverless application locally

````
SERVERLESS_DEPLOYMENT=false AWS_ACCESS_KEY_ID={AWS_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY={AWS_SECRET_ACCESS_KEY} AWS_DEPLOYMENT_REGION=us-west-2 AWS_DEPLOYMENT_STAGE=dev OPEN_AI_KEY={OPEN_AI_KEY} npm run start:local
````

## Deploy the application to serverless

````
SERVERLESS_DEPLOYMENT=false AWS_ACCESS_KEY_ID={AWS_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY={AWS_SECRET_ACCESS_KEY} AWS_DEPLOYMENT_REGION=us-west-2 AWS_DEPLOYMENT_STAGE=dev OPEN_AI_KEY={OPEN_AI_KEY} npm run deploy
````

