const express = require('express');
const bodyParser = require('body-parser');
const sls = require('serverless-http');
const morgan = require('morgan');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");
const environment = require('./environment.js');

const configuration = new Configuration({
  apiKey: environment.environment.openAIKey,
});
const openAI = new OpenAIApi(configuration);

const app = express();
app.use(
    cors({
      origin: '*', // TODO: Update to proper origins
      credentials: true,
      allowedHeaders: [
        'Authorization',
        'caramel-transaction-session-id',
        'persona-signature',
        'Connection',
        'Accept-Encoding',
        'Accept',
        'User-Agent',
        'Host',
        'Content-Type',
        'Content-Length',
        'Postman-Token',
      ],
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/feedbacks', async (req, res) => {
  console.log(JSON.stringify(req.body));

  if (!req.body?.type || !req.body?.reviews || !req.body?.reviews?.length) {
    return res.status(400).send('Missing parameters - type or reviews');
  }

  let reviews = '';
  req.body.reviews.forEach((item) => {
    reviews = reviews + `\n${item.question} ${item.answer}`;
  });
  console.log('Framed the reviews prompt - ', reviews);

  const response = await openAI.createCompletion({
    model: "text-davinci-003",
    prompt: `Create a feedback testimonial based on the questions and answers below for ${req.body.type} .\n${reviews}`,
    temperature: 1.57,
    max_tokens: 2500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log('Received the response from Open AI - ', JSON.stringify(response.data));

  return res.status(200).send(response?.data?.choices?.[0].text || '');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).send('Something went wrong!');
});

if (!environment.serverlessDeployment) {
    app.listen(3000, () => {
        console.log('Server started on port 3000');
      });
}

process
  .on('SIGTERM', () => {
    console.log(`Process ${process.pid} received a SIGTERM signal`);
    process.exit(1);
  })
  .on('SIGINT', (signal) => {
    console.log(
        `Process ${process.pid} has been interrupted with signal :`,
        signal,
    );
    process.exit(1);
  })
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    process.exit(1);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

// Create the serverless API app
const serverlessAPI = sls(app);

// Wrap the API to initialize the environment once per lambda cold start
async function restHandler(
  event,
  context,
) {
  return await serverlessAPI(event, context);
}

module.exports.restHandler = restHandler;

