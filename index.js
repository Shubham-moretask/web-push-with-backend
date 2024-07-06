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
  const {subscription,website} =req.body;
  const { endpoint, keys} = subscription;
  try {
    // Check if a subscription with the given endpoint already exists
    let subscriptionData = await Subscription.findOne({ endpoint,website });

    if (!subscriptionData) {
      // Create a new subscription if it does not exist
      subscriptionData = new Subscription({ endpoint, keys,website });
      await subscriptionData.save();
    }

    console.log(req.body,"Object--> ",subscription);

    res.status(201).json({});

    const payload = JSON.stringify({ title: 'Push Test'});

    webpush.sendNotification(subscription, payload)
      .catch(err => console.error('Error sending push notification:', err));
  } catch (error) {
    console.error('Error handling subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/sendNotification', async (req, res) => {
  const { endpoint } = req.body;
  
  try {
    // Fetch the subscription from the database
    const subscriptionData = await Subscription.findOne({ endpoint });
    console.log(subscriptionData)

    if (!subscriptionData) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const subscription = {
      endpoint: subscriptionData.endpoint,
      keys: subscriptionData.keys
    };

    //dynamic payload for multiple user's 
    const payload =JSON.stringify(req.body)

    // Send notification
    await webpush.sendNotification(subscription, payload);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post('/sendNotifications', async (req, res) => {
  try {
    
    // Fetch all subscriptions from the database
    const subscriptions = await Subscription.find({});

    // Payload for the notification
    const payload=JSON.stringify(req.body);
    
    // Send notification to each subscription
    const sendNotifications = subscriptions.map(subscription => {
      const { endpoint, keys } = subscription;
      const subscriptionObject = { endpoint, keys };
      return webpush.sendNotification(subscriptionObject, payload)
        .catch(err => console.error('Error sending push notification:', err));
    });

    // Wait for all notifications to be sent
    await Promise.all(sendNotifications);

    res.status(200).json({ message: 'Notifications sent successfully.' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

