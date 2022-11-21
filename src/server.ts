import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async ( req, res ) => {
    const {image_url} = req.query;

    if(!isValidUrl(image_url)){
      res.status(400).send("Please privide a proper image url");
      return;
    }

    let filteredImagePath:string = null;

    try{
      const filteredImagePath = await filterImageFromURL(image_url);
      res.sendFile(filteredImagePath);
    }catch(error){
      res.status(500).send(`An error has occured: ${error.message}`);
    }

    if(!filterImageFromURL){
      try{
        await deleteLocalFiles([filteredImagePath]);
      }catch(error){
        console.log(`Failed to delete file: ${filteredImagePath}`);
      }
    }
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();