const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv= require("dotenv");
const cors=require("cors");
const Subscription = require('./model/Subscription');
const db = require('./config/db');
const app = express();
const port = 5000;
dotenv.config();


db();
app.use(cors());
// Middleware
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());
// VAPID keys

const publicVapidKey="BKfPlTWGsnyEIxx1FygtT-fOq4IG6d4FdMyqFl2aduJqZ5BQa_YMs3PkIS9NMflBtRbdgTGm3iX575cvidG1VgU";
const privateVapidKey="IJkrCjxCNmbelKQ9MFdCIQXGv-oThPZ16_-1wM-NSus"
webpush.setVapidDetails('mailto:sk9664150090@gmail.com', publicVapidKey, privateVapidKey);



app.post('/subscribe', async (req, res) => {
  // Save subscription to MongoDB
  const { endpoint, keys } = req.body;

  try {
    // Check if a subscription with the given endpoint already exists
    let subscriptionData = await Subscription.findOne({ endpoint });

    if (!subscriptionData) {
      // Create a new subscription if it does not exist
      subscriptionData = new Subscription({ endpoint, keys });
      await subscriptionData.save();
    }

    console.log(req.body);

    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'Push Test' });
    webpush.sendNotification(subscription, payload)
      .catch(err => console.error('Error sending push notification:', err));
  } catch (error) {
    console.error('Error handling subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Subscribe Route
// app.post('/subscribe', async (req, res) => {
//      // Save subscription to MongoDB
//      const { endpoint, keys } = req.body;

//      const subscriptionData = new Subscription({
//          endpoint,
//          keys
//      });
//      await subscriptionData.save();

//        console.log(req.body)
  
//   const subscription = req.body;
//   res.status(201).json({});
//   const payload = JSON.stringify({ title: 'Push Test' });
//   webpush.sendNotification(subscription, payload)
//     .catch(err => console.error('Error sending push notification:', err));
// });

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


// const express = require('express');
// const webpush = require('web-push');
// const bodyParser = require('body-parser');
// const path = require('path');
// const cors=require("cors");
// const app = express();
// const port = 5000;


// // Middleware
// app.use(cors());
// app.options('*', cors());
// app.use(express.static(path.join(__dirname, 'client')));
// app.use(bodyParser.json());
// // VAPID keys
// const publicVapidKey = "BGdKZpLftO5LfmAIXGiYccQO9APYFJqMwn-42WgtATEBV7kuT2fUIyL8Ugv3oKbEZt21d7KTeUxog9dTqR9CKe4";

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