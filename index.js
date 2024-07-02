// const express = require('express');
// const webpush = require('web-push');
// const bodyParser = require('body-parser');
// const path = require('path');
// const cors=require("cors");
// const app = express();
// const port = 5000;

// app.use(cors());
// // Middleware
// app.use(express.static(path.join(__dirname, 'client')));

// app.use(bodyParser.json());
// // VAPID keys

// const publicVapidKey="BKfPlTWGsnyEIxx1FygtT-fOq4IG6d4FdMyqFl2aduJqZ5BQa_YMs3PkIS9NMflBtRbdgTGm3iX575cvidG1VgU";
const privateVapidKey="IJkrCjxCNmbelKQ9MFdCIQXGv-oThPZ16_-1wM-NSus"
// webpush.setVapidDetails('mailto:sk9664150090@gmail.com', publicVapidKey, privateVapidKey);

// // Subscribe Route
// app.post('/subscribe', (req, res) => {
//   console.log(req.body)
//   const subscription = req.body;
//   res.status(201).json({});
//   const payload = JSON.stringify({ title: 'Push Test' });
//   webpush.sendNotification(subscription, payload)
//     .catch(err => console.error('Error sending push notification:', err));
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const cors=require("cors");
const app = express();
const port = 5000;


// Middleware
app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());
// VAPID keys
const publicVapidKey = "BGdKZpLftO5LfmAIXGiYccQO9APYFJqMwn-42WgtATEBV7kuT2fUIyL8Ugv3oKbEZt21d7KTeUxog9dTqR9CKe4";

webpush.setVapidDetails('mailto:sk9664150090@gmail.com', publicVapidKey, privateVapidKey);

// Subscribe Route
app.post('/subscribe', (req, res) => {
  console.log(req.body)
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'Push Test' });
  webpush.sendNotification(subscription, payload)
    .catch(err => console.error('Error sending push notification:', err));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});