/**
 * This the greatest API of all time!
 * There is no any better (never was and never will be) - trust me!
 *
 * It return fake images using package of 80 images
 * It does not use any S3 bucket, any AWS or something like that
 * It is just fake/mock to test the frontend
 */

const express = require('express');

// DEBUG
// const moment = require('moment');

const app = express();

const PORT = 4001;

/**
 * CHANGE THAT TO SET MACX NUMBER OF IMAGES RETURNED BY THIS ENDPOINT
 */
const TOTAL_FAKE_IMAGES_NUMBER = 10000;

const DEFAULT_LIMIT = 10;

// Add headers
app.use((req, res, next) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/images', async (req, res) => {
  // emulate the invalid responses - if needed...
  // const mathRandom = Math.random();
  // const statusCode = mathRandom > 0.5 ? 400 : 200;
  const statusCode = 200;

  // prepare params
  const params = {};
  ['limit', 'offset', 'imgHeight', 'imgWidth'].forEach(paramName => {
    params[paramName] = req.query[paramName] ? Math.ceil(parseInt(req.query[paramName])) : 0;
  });

  if (!params.limit) {
    params.limit = DEFAULT_LIMIT;
  }


  if (params.imgHeight < 10 || params.imgHeight > 500) {
    params.imgHeight = 200;
  }

  if (params.imgWidth < 10 || params.imgWidth > 500) {
    params.imgHeight = 150;
  }

  if (params.offset >= TOTAL_FAKE_IMAGES_NUMBER) {
    params.offset = TOTAL_FAKE_IMAGES_NUMBER;
    params.limit = 0;
  }

  const jsonResponseData = {
    totalCount: TOTAL_FAKE_IMAGES_NUMBER,
    results: []
  };

  // DEBUG
  const log = {
    limit: params.limit,
    offset: params.offset,
  };

  if (params.limit > 0) {
    // determine the last image to return
    let lastImageNumber = params.offset + params.limit;
    if (lastImageNumber >= TOTAL_FAKE_IMAGES_NUMBER) {
      lastImageNumber = TOTAL_FAKE_IMAGES_NUMBER;
    } else {
      jsonResponseData.next = lastImageNumber + 1;
    }

    for (let i = params.offset; i < lastImageNumber; i++) {
      // there is 80 fake image available so they are used all over again
      const imageFakeId = i % 80;

      jsonResponseData.results.push({
        // image: `https://picsum.photos/id/${imageFakeId}/150/200?avoidCaching=${moment().unix()}`,
        image: `https://picsum.photos/id/${imageFakeId}/${params.imgHeight}/${params.imgWidth}`,
        title: `this is wonderful image titled image_${i}`,
        description: `This is wonderful image called IMAGE_${i} - isn't it nice? :)`,
      });
    }

    // DEBUG
    log.lastImageNumber = lastImageNumber;
  }

  // DEBUG
  console.log(`GET /goals: statusCode ${statusCode} | limit ${log.limit} | offset ${log.offset} | lastImageNumber ${log.lastImageNumber}`);

  res.statusCode = statusCode;
  res.json(jsonResponseData);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
