const path = require('path');
const express = require('express');
const app = express();

const nunjucks = require('nunjucks');
nunjucks.configure({ noCache: true });

const db = require('./db');
const { Employee } = db.models;

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.use(require('body-parser').urlencoded());
app.use(require('method-override')('_method'));
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use((req, res, next)=> {
  res.locals.path = req.url;
  next();
});


app.use('/', require('./routes'));

app.use((err, req, res, next)=> {
  console.log(err);
  res.render('error', { error: err });
});

db.sync()
  .then(()=> db.seed());

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on ${port}`));
