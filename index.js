const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const port = 4000; // Replace with your desired port

// Replace with your own secret key used in the GitHub webhook configuration
const webhookSecret = 'adaa4ffa6e3983e55271bae9d7e1800a6c2dc5768134b9aaafe22b6198b665d4';

app.use(express.json());

app.post('/webhook', (req, res) => {

  const payload = JSON.stringify(req.body);
  const signature = req.headers['x-hub-signature-256'];

  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(payload);

  const calculatedSignature = `sha256=${hmac.digest('hex')}`;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) {
    console.log("req.body", req.body)
    // Valid payload, do something with the new commit information
    console.log('New commit pushed:', req.body.head_commit.message);
  } else {
    console.log('Invalid signature');
  }

  res.status(200).send('OK');
});

app.get("/testing", (req, res) => {
  res.write('A Monk in Cloud'); //write a response to the client
  res.end(); //end the response
})

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
