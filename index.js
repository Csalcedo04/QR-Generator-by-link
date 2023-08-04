// import inquirer from 'inquirer';
import qr from "qr-image";
import fs from "fs";
import  express  from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from 'body-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const Port = 3000
const app= express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.get("/",(req, res)=>{
  res.sendFile(__dirname+"/public/index.html")
})

app.post("/submit", (req,res)=>{
  res.sendFile(__dirname+"/public/index.html")
})

function erease(req, res, next){
  const oldQr = __dirname+"/public/qr_img.png"
  if(typeof oldQr !== "undefined"){
    fs.unlink(oldQr, (err) => {
      if (err) {
        console.error('Error al borrar el archivo:', err);
      } else {
        console.log('Archivo borrado exitosamente.');
      }
    });
  }
  next()
}
app.use(erease);

function QrGen(req,res,next){
  const url = req.body.qr;
  var qr_png = qr.image(`${url}`, { type: 'png' });
  qr_png.pipe(fs.createWriteStream("qr_img.png"));
  var  oldPath= `${__dirname}/qr_img.png`
  var newPath= `${__dirname}/public/qr_img.png`;
  
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('Error al mover el archivo:', err);
      } else {
        console.log('Archivo movido exitosamente.');
      }
    });
    if(typeof oldPath !== "undefined"){
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error('Error al borrar el archivo:', err);
        } else {
          console.log('Archivo borrado exitosamente.');
        }
      });
    }
  next();
}
app.use(QrGen);
app.listen(Port, ()=>{
  console.log(`working on ${Port}`)
})

// //code to try in console
//  inquirer
//    .prompt([
//      {
//          message:'Type in your URL:',
//         name:'URL'
//      }
//    ])
//    .then((answers) => {
//      const url = answers.URL
//      var qr_png = qr.image(`${url}`, { type: 'png' });
//      qr_png.pipe(fs.createWriteStream("qr_img.png"));
//    })
//    .catch((error) => {
//      if (error.isTtyError) {
//        // Prompt couldn't be rendered in the current environment
//      } else {
//        // Something else went wrong
//      }
//    });