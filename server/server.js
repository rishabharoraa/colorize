const express = require('express');
const bodyParser = require('body-parser');
const colorThief = require('colorthief');
const fs = require('fs');
const { v4:uuidv4 } = require('uuid');

const app = express();
const port = 5000;
const router = express.Router();

//CORS middleware
var corsMiddleware = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //replace * with actual host
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

  next();
}

app.use(bodyParser.urlencoded( { extended: false } ));
app.use(bodyParser.json( { limit: '10MB' } ));
app.use(corsMiddleware);


// save the image so it can be sent to colorThief as a param (can this be done better??)
const saveImage = (imgData, path) => {
  let B64image = imgData.split(';base64,').pop();
  return new Promise((resolve, reject) => {
    fs.writeFile(path, B64image, {encoding: 'base64'}, err => {
      if(err) reject(err);
      resolve('File Created');
    })
  })
}

// convert [RR,GG,BB] to #RRGGBB before sending 
function convertToHexColorValues(data) {
  let res = [];
  data.forEach(element => {
    let temp = '#';
    element.forEach(val => {
      hex = val.toString(16);
      temp += hex.length === 1 ? '0' + hex : hex;
    });
    res.push(temp);
  });
  return res;
}


// generate image palette from image path
function getColorPalette(path) { 
  // take image in b64 and convert
  return  colorThief.getPalette(path, 12, 1);
}

router.post('/', async (req,res) => {

  // parsing input and creating path for later use
  console.log("Got a req!!!!");
  let data = req.body.data;
  let type = req.body.type;
  let path = './' + uuidv4() + '.' + type;
  console.log(path);


  // save image
  saveImage(data, path).then(async () => {
    // get image palette
    let a = await getColorPalette(path).then(palette => {return palette});
    // send image palette
    res.send(convertToHexColorValues(a));
    // delete image
    fs.unlink(path, (err) => {
      if(err) {
        console.error(err);
        return;
      }
    })
  })
});

app.use('/api', router);

app.listen(port, () => console.log(`Server running on: http://localhost:${port}`));