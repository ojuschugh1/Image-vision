var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

router.post('/classify', (req, res, next) => {

  if (!req.files || req.files.length == 0) {
    res.status(400).json({
      "error": "No Image Uploaded."
    });

    return;
  }

  // AWS Rekognition Configuration
  const config = new AWS.Config({
    accessKeyId: 'AKIARAR74F5B2ZJFROOU',
    secretAccessKey: '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',
    region: 'us-east-1'
  });

  AWS.config.update(config);

  //AWS Rekognition Client
  const client = new AWS.Rekognition();

  const uploadedFile = req.files.file;

  //Bind buffer data of image as a parameter
  const params = {
    Image: {
      Bytes: uploadedFile.data
    },
  };

  client.detectLabels(params, (awsErr, awsRes) => {

    //Handle errors from AWS service
    if (awsErr) {
      console.log(awsErr);

      res.status(500).json({
        "error": "Internal server error."
      });

    } else {
      res.json({
        "labels": awsRes.Labels.map((label) => label.Name)
      });
    }

  });
});

module.exports = router;