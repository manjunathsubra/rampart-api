exports.environment = {
    serverlessDeployment: process.env.SERVERLESS_DEPLOYMENT
        ? /^true$/.test(process.env.SERVERLESS_DEPLOYMENT)
        : false,
    openAIKey: process.env.OPEN_AI_KEY || '',
}