import mongoose from 'mongoose'
import options from '../../configs'

export const connect = async (url = options.dbUrl) => {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};
