const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 4000; // Replace with your desired port

// Replace with your own secret key used in the GitHub webhook configuration
const webhookSecret = 'b6d331691df82d12afd2b0149f998dade5c58085b4b5bfe400e4d5de0147664d';

app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

// app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('Raw Body:', req.rawBody); // Check if req.rawBody is defined

  const payload = req.rawBody;
  const signature = req.headers['x-hub-signature-256'];

  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(payload);

  const calculatedSignature = `sha256=${hmac.digest('hex')}`;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) {
    // Valid payload, do something with the new commit information
    console.log('New commit pushed:', req.body.head_commit.message);
  } else {
    console.log('Invalid signature');
  }

  res.status(200).send('OK');
});

app.get("/testing", (req, res) => {
  res.write('A Monk in Cloudzsssaddsasdadsd fucked asdup'); //write a response to the client
  res.end(); //end the response
})

app.listen(port, () => {
  console.log(`Webhook server liasdstening on port ${port}`);
});
