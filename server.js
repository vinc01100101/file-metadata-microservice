const express = require('express');
const app = express();
const formidable = require('formidable')
const path = require('path')
require('dotenv').config();

app.use((req,res,next)=>{
	console.log(
		"-----------------------\n" +
		req.method + '||' + req.path + '||' + (req.headers['x-forwarded-for']  || req.connection.remoteAddress)
	)
	next();
})

app.use(express.static(__dirname+ '/public/'));
app.use(express.text({extended: false}));

app.get('/',(req,res)=>{
	res.sendFile(__dirname + '/view/index.html');
})

app.post('/api/fileanalyse',(req,res)=>{
  const form = new formidable.IncomingForm().parse(req);
  form.maxFileSize = 30*1024*1024*1024;
  
  form .on('fileBegin', (name, file) => {
		console.log('User uploading...');
        file.path = __dirname + '/uploads/' + file.name;
    })
    .on('file', (name, file) => {
		res.json({name: file.name, size: file.size, type: file.type})
      console.log('Uploaded file')
    })
    .on('aborted', () => {
      console.log('Request aborted by the user')
    })
    .on('error', (err) => {
      console.error('Error', err.message)
    })
    .on('end', () => {
		console.log('Upload ended')
		res.end()
    })
})

app.get('/api/download',(req,res)=>{

	res.set('Content-Type','multipart/form-data')
	res.download(__dirname + '/uploads/blueporing.jpg','PoringImage.jpg')
})

const port = process.env.PORT
app.listen(port,()=>{
	console.log('Listening to port: ' + port);
})