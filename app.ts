import express, { json } from 'express';
import { getWeather } from './weather';

const makeApp = ({ createExercise, getExerciseById, getAllExercise }: any) => {
  const app = express();

  app.use(json());

  app.post('/exercise', async (req, res) => {
    const exercise = await createExercise(req.body);
    res.json(exercise);
  });

  app.get('/exercise', async (req, res) => {
    res.json(await getAllExercise());
  });

  app.get('/exercise/:id', async (req, res) => {
    const exercise = await getExerciseById(req.params.id);

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
