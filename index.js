const express = require('express');

const app = express();

if (process.env.NODE_ENV === 'production') {
  //Express will serve up production assests like main.js and main.css
  app.use(express.static('client/dist'));

  //Express will serve up index.html file if it doesn't recognisze the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log('Express listening on port', this.address().port);
});
