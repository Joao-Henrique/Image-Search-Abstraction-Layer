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
////  GET ALL RECENTSEARCHES FROM THE DATABASE  ////
app.get('/api/recentsearchs', (req, res) => {
  searchTerm.find({}).sort({date:-1}).exec((err, data) => 
    {
      res.json(data);
    }
)})
// END /////////////////////////////////////////////
////////////////////////////////////////////////////


////////////////////////////////////////////////////
////  GET CALL WITH PARAMS TO SEARCH FOR IMAGES  ///
app.get('/api/imagesearch/:searchVal*', (req, res) => {
  var { searchVal } = req.params;
  var { offset } = req.query;
  var data = new searchTerm({
    searchVal,
    searchDate: new Date()
  });
// SAVE DATA TO COLLECTION
  data.save(err => {
    if (err) {
      res.send('Error Saving to database');
    }
// PREVENT APP CRASH IF NO OFFSET IS DEFINED
    var searchOffset;
    if (searchOffset === undefined) {
      searchOffset=1;
      offset=0;
    }
// DEFINING OFFSET
    if (offset){
      if (offset == 1) {
        offset = 0;
        searchOffset = 1;
      }
      else if (offset > 1) {
        searchOffset = offset + 1;
      }
      else {
        offset = 0;
        searchOffset = 1;
      }
    }
// WORK WITH BING API
    Bing.images(searchVal, {
      top: ( 10 * searchOffset ),
      skip: ( 10 * offset )
    }, function(error, rez, body){
      var bingData = [];

      for (var i=0; i<10; i++){
        bingData.push({
          url: body.value[i].webSearchUrl,
          snippet: body.value[i]. name,
          tumbnail: body.value[i].thumbnailUrl,
          context: body.value[i].hostPageDisplayUrl
        });
      }
      res.json(bingData);
    })
  });
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