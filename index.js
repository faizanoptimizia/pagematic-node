const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const port = 4000; // Replace with your desired port

// Replace with your own secret key used in the GitHub webhook configuration
const webhookSecret = 'b6d331691df82d12afd2b0149f998dade5c58085b4b5bfe400e4d5de0147664d';

app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

app.post('/webhook', (req, res) => {
  const payload = req.rawBody;
  const signature = req.headers['x-hub-signature-256'];

  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(payload);

  const calculatedSignature = `sha256=${hmac.digest('hex')}`;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature))) {
    // Valid payload, do something with the new commit information
    const { ref } = req.body;

    if (ref === 'refs/heads/master') {
      // Pull from GitHub when master branch is pushed to
      exec('git pull origin master', (error, stdout, stderr) => {
        if (error) {
          console.error('Error during pull:', error);
          return res.status(500).send('Error during pull');
        }
  
        console.log('Git pull completed successfully:', stdout);

        // Restart the server using pm2
        exec('pm2 restart index.js', (error) => {
          if (error) {
            console.error('Error during server restart:', error);
          }
        });
      });
    } else {
      console.log('Ignoring push to branch other than master');
      return res.status(200).send('Ignoring push to branch other than master');
    }
  } else {
    console.log('Invalid signature');
  }

  res.status(200).send('OK');
});

app.get("/testing", (req, res) => {
  res.write('A Monk in Cloud nopy shopy'); //write a response to the client
  res.end(); //end the response
})

app.get("/random", (req, res) => {
  res.write('hello world'); //write a response to the client
  res.end(); //end the response
})

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
