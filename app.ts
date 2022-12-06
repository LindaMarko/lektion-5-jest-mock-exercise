import express, { json } from 'express';
import { getWeather } from './weather';

const makeApp = ({ createExercise, getExerciseById, getAllExercise }: any) => {
  const app = express();

  app.use(json());

  app.post('/exercise', async (req, res) => {
    const errors = [];

    if (!req.body.startTime || req.body.startTime.length === 0) {
      errors.push({
        error: 'You must provide a starting time',
      });
    }

    if (
      !req.body.durationInSeconds ||
      isNaN(Number(req.body.durationInSeconds))
    ) {
      errors.push({
        error: 'You must provide a duration',
      });
    }

    if (!req.body.activityType || req.body.activityType === 0) {
      errors.push({
        error: 'You must provide an activity type',
      });
    }

    if (errors.length) {
      res.status(400).json(errors);
    } else {
      const exercise = await createExercise(req.body);
      console.log(exercise)
      
      res.json(exercise);
    }
  });

  app.get('/exercise', async (req, res) => {
    res.json(await getAllExercise());
  });

  app.get('/exercise/:id', async (req, res) => {
    const exercise = await getExerciseById(req.params.id);
    console.log(exercise)

    if (!exercise) {
      res.status(404).send();
    } else {
      const weatherAPI = await getWeather();
      res.json({
        startTime: exercise.startTime,
        durationInSeconds: exercise.durationInSeconds,
        activityType: exercise.activityType,
        temperature: weatherAPI.data.daily.temperature_2m_max[0],
      });
    }
  });

  return app;
};

export default makeApp;
