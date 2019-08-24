export const handleUrlVerification = (body: { challenge: string }) => ({
  statusCode: 200,
  body: body.challenge
});
