import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    mongoose.connect('mongodb+srv://cleverice90128:cleverice007@cluster0.ckooh1c.mongodb.net/ticket-microservice?retryWrites=true&w=majority');
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
     console.log('docker test ');
  });
};

start();
