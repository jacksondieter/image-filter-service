import express,{Request, Response} from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(express.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file 

  app.get("/filteredimage", async (req:Request, res:Response) => {
    const {image_url}= req.query
    if (!image_url) {
      return res.status(400)
                .send("url required")
    }
    try {
      const image_path = await filterImageFromURL(image_url as string)
      res.status(200).sendFile(image_path,()=>deleteLocalFiles([image_path]))
    } catch (error) {
      return res.status(404)
                .send("Image not found")
    }
    
  })
  
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