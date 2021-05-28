const express = require('express');
const colorThief = require('colorthief');

const app = express();
const port = 5000;
const router = express.Router();

function convertToHexColorValues(data) {
  let res = [];
  data.forEach(element => {
    let temp = '#';
    element.forEach(val => {
      temp += val.toString(16);
    });
    res.push(temp);
  });
  return res;
}

function temp() {
  let img = './sample.jpg'; 
  //take image in b64 and convert
  return  colorThief.getPalette(img, 8);
}

router.get('/', async (req,res) => {
  console.log(`GET http://localhost:${port}`);
  data = await temp().then(palette => {return palette});
  res.json(convertToHexColorValues(data));
});

app.use('/api', router);

app.listen(port, () => console.log(`Server running on: http://localhost:${port}`));