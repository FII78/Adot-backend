import express from 'express';
import router from './app';
import {connect}  from './utils/db/setupDb'; 

// Create an instance of the Express application
const app = express();

// Configure middleware

// Mount the router
app.use('/', router);

// Start the server
const port = process.env.PORT || 3000;
connect()
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
