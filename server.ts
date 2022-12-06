import makeApp from './app';
import mongoose from 'mongoose';
import { createExercise, getExerciseById, getAllExercise } from './database';

const port = process.env.PORT || 8080;

const app = makeApp({ createExercise, getExerciseById, getAllExercise });

mongoose.connect('mongodb://localhost:27017/myapp').then(() => {
  app.listen(port, () => {
    console.log(`App listening to port ${port}`);
  });
});
