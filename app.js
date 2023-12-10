import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { uploadFileToIPFS,uploadJSONToIPFS } from './ipfs-uploader.js'; 
import { mint } from './nft-minter.js';  
import dotenv from 'dotenv';
dotenv.config("./.env");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());

app.get('/', (req, res) => { 
  res.render("home");
});

app.post("/upload", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const file = req.files.file;
  const fileName = file.name;
  const filePath="files/"+fileName;
  file.mv(filePath, async (err) => {
    if (err) {
      console.log(`Error: ${err}`);
      res.status(500).send("Error occured");
    }
    const fileResult = await uploadFileToIPFS(filePath);
    const fileCid = fileResult.cid.toString();

    const metadata = {
      title: title,
      description: description,
      image: 'http://43.129.194.130:8080/ipfs/'+ fileCid
    };
    const metadataResult = await uploadJSONToIPFS(metadata);
    const metadataCid = metadataResult.cid.toString();
    console.log(metadataCid);

    await mint(process.env.ADDRESS,'http://43.129.194.130:8080/ipfs/'+metadataCid);
    res.json(
      { 
      message: "File uploaded successfully", 
      metadata: metadata,
    }
      )
  })
  }); 
  

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});