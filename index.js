const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// app.use(fileUpload({
//     createParentPath: true,
//     limits: {
//         fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
//     },
// }));
//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('uploads'));
//start app
const port = process.env.PORT || 4000;

app.listen(port, () =>
  console.log(`App is listening on port ${port}.`)
);

app.post('/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let data = req.files.data;
            // $name='myfile_'.date('m-d-Y_hia');
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            data.mv('./uploads/' + data.name + Date.now());
             //+ new Date to get the current timestamp in JavaScript
            //or + new Date
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: data.name,
                    mimetype: data.mimetype,
                    size: data.size,
                    date: new Date
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


app.post('/upload-photos', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = [];

            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];

                //move photo to uploads directory
                photo.mv('./uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });

            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data,
                date: new Date
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
//https://attacomsian.com/blog/uploading-files-nodejs-express#file-size-limit
