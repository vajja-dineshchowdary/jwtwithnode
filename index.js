const express = require('express');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 8686;
const www = process.env.WWW || './';

app.use(express.static(www));
console.log(`serving ${www}`);


app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secreatkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post Created',
        authData
      })
    }
  })
});

app.post('/api/login', (req, res) => {
  //mock user
  const user = {
    id: 1,
    username: 'dinesh',
    email: 'dinesh@yopmail.com'
  }


  jwt.sign({user}, 'secreatkey', { expiresIn: '30s'}, (err, token) => {
    res.json({
      token
    })
  });
});


function verifyToken(req, res, next) {
  // get auth header value
  const bearerheader = req.headers['authorization'];

  if(typeof bearerheader !== 'undefined') {
    // split at the space
    const bearer = bearerheader.split(' ');
   const bearerToken = bearer[1];
   req.token = bearerToken;
   next();
  } else {
    res.sendStatus(403);
  }

}

app.get('/api', (req, res) => {
  res.json({message: 'Welcome to the API'});
});
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
