

console.log('Service Worker Loaded...');
self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push Received:', data);

  const options = {
    body: 'Notified by MoreTasks',
    icon: 'https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.1141335507.1719273600&semt=sph',
    data: {
      url:'https://www.feedants.com/#'  
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = event.notification.data.url ||  "https://www.feedants.com/#"

  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
