//////////////////////////////////////////////////
///////////   REQUIRE MODULES   //////////////////
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Bing = require('node-bing-api')({accKey: 'a8f31032970a4e1da45d5e179c88b757'});
const searchTerm = require('./models/searchTerm.js')
app.use(bodyParser.json());
app.use(cors());
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
////////////   CONNECT TO DATABASE   ///////////////
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds121464.mlab.com:21464/imagesearchdb')
var db = mongoose.connection
db.on('error',console.error.bind(console,'connection error:'))
db.once('open', () => {
    console.log('CONNECTED TO DATABASE')
});
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
////   GET ALL SEARCH TERMS FROM THE DATABASE   ////
app.get('/api/recentsearchs', (req, res, next) => {
  searchTerm.find({}, (err, data) => 
    {
      res.json(data);
    })
})
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
////  GET CALL WITH PARAMS TO SEARCH FOR IMAGES  ///
app.get('/api/imagesearch/:searchVal*', (req, res, next) => {
  var { searchVal } = req.params;
  var { offset } = req.query;

  var data = new searchTerm({
    searchVal,
    searchDate: new Date()
  });

  data.save(err => {
    if (err) {
      res.send('Error Saving to database');
    }
    res.json(data);
  });
 // return res.json({
 //   searchVal,
 //   offset
 // });
}); 
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
////////////   LISTEN ON PORT   ////////////////////
app.listen( 3000, () => {
  console.log('SERVER IS RUNNING...')
});
// END /////////////////////////////////////////////
////////////////////////////////////////////////////