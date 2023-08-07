const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const port = 4000; // Replace with your desired port

// Replace with your own secret key used in the GitHub webhook configuration
const webhookSecret = 'adaa4ffa6e3983e55271bae9d7e1800a6c2dc5768134b9aaafe22b6198b665d4';

app.use(express.json());

app.post('/webhook', (req, res) => {

  console.log("req", req)
  const { ref } = req.body;

  console.log("ref", ref)
  if (ref === 'refs/heads/master') {
    // Pull from GitHub when master branch is pushed to
    exec('git pull origin master', (error, stdout, stderr) => {
      if (error) {
        console.error('Error during pull:', error);
        return res.status(500).send('Error during pull');
      }

      console.log('Git21331221qewq3 pull completed successfully:12354', stdout);
      return res.status(200).send('Git pull completed successfully');
    });
  } else {
    console.log('Ignoring push to branch other than master');
    return res.status(200).send('Ignoring push to branch other than master');
  }

  // const payload = JSON.stringify(req.body);
  // const signature = req.headers['x-hub-signature-256'];

  // const hmac = crypto.createHmac('sha256', webhookSecret);
  // hmac.update(payload);

  // const calculatedSignature = `sha256=${hmac.digest('hex')}`;

  // if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) {
  //   // Valid payload, do something with the new commit information
  //   console.log('New commit pushed:', req.body.head_commit.message);
  // } else {
  //   console.log('Invalid signature');
  // }

  // res.status(200).send('OK');
});

app.get("/testing", (req, res) => {
  res.write('A Monk in Cloud'); //write a response to the client
  res.end(); //end the response
})

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
