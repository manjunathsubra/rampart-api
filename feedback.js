const config = require('./config.json');
const { Configuration, OpenAIApi } = require("openai");
const environment = require('./environment.js');
const configuration = new Configuration({
  apiKey: environment.environment.openAIKey,
});
const openAI = new OpenAIApi(configuration);


module.exports = async (req, res) => {
  console.log(JSON.stringify(req.body));

  if (!req.body?.id || !req.body?.reviews || !req.body?.reviews?.length) {
    return res.status(400).send("Missing parameters - id or reviews");
  }

  let reviews = "";
  req.body.reviews.forEach((item) => {
    reviews = reviews + `\n${item.question} ${item.answer}`;
  });
  console.log("Framed the reviews prompt - ", reviews);

  const configData = config[req.body.id];
  console.log("Config found - ", JSON.stringify(configData));

  const requestData = {
    model: "text-davinci-003",
    prompt: `Create a short feedback testimonial based on the questions and answers below for ${configData.name}. ${configData.description} Do not use words ${configData.keysToExclude}.\n${reviews}`,
    // prompt: `Create a feedback testimonial based on the questions and answers below for ${req.body.type} .\n${reviews}`,
    temperature: 1.2,
    max_tokens: 2500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
  console.log(
    "Created the request for Open AI - ",
    JSON.stringify(requestData)
  );

  const response = await openAI.createCompletion(requestData);
  console.log(
    "Received the reviews from Open AI - ",
    JSON.stringify(response.data)
  );
  const feedbacks = response?.data?.choices?.[0].text || "";

  let hashtags;
  if (feedbacks?.length) {
    const response = await openAI.createCompletion({
      model: "text-davinci-003",
      prompt: `Create hashtags for the feedback: \n${feedbacks}`,
      temperature: 1.57,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(
      "Received the hashtags from Open AI - ",
      JSON.stringify(response.data)
    );
    hashtags = response?.data?.choices?.[0].text || "";
  }

  let rating;
  if (feedbacks?.length) {
    const response = await openAI.createCompletion({
      model: "text-davinci-003",
      prompt: `Give a rating from scale 1-5 for review: \n${feedbacks}`,
      temperature: 1.57,
      max_tokens: 2500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(
      "Received the rating from Open AI - ",
      JSON.stringify(response.data)
    );
    const ratingText = response?.data?.choices?.[0].text || "";
    rating = Number(ratingText.match(/\d+/)[0] || 3);
  }

  return res.status(200).json({
    feedbacks,
    ...(hashtags && { hashtags }),
    ...(rating && { rating }),
  });
};
