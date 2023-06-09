const axios = require("axios");
const engineId = "stable-diffusion-v1-5";
const apiHost = process.env.API_HOST ?? "https://api.stability.ai";
const apiKey = process.env.STABILITY_API_KEY;
if (!apiKey) throw new Error("Missing Stability API key.");

module.exports = async (req, res) => {
  try {
    console.log("imageGeneration API invoked");
    req.body.style_preset = 'photographic'
    const { data } = await axios.post(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    console.log("got response form stability API");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
