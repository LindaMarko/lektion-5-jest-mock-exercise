import request from 'supertest';
import makeApp from './app';
import nock from 'nock';

const createExercise = jest.fn();
const getExerciseById = jest.fn();
const getAllExercise = jest.fn();

const app = makeApp({ createExercise, getExerciseById, getAllExercise });

const validExerciseData = {
  startTime: '2022-01-01 11:50',
  durationInSeconds: 60,
  activityType: 'running',
};

describe('POST /exersice', () => {
  
  beforeAll(() => {
    nock('https://api.open-meteo.com')
      .get(
        '/v1/forecast?latitude=52.52&longitude=13.41&start_date=2022-06-08&end_date=2022-06-08&daily=temperature_2m_max&timezone=GMT'
      )
      .times(1)
      .reply(200, {
        "latitude":52.52,
        "longitude":13.419998,
        "generationtime_ms":0.2880096435546875,
        "utc_offset_seconds":0,
        "timezone":"GMT",
        "timezone_abbreviation":"GMT",
        "elevation":38.0,
        "daily_units":{"time":"iso8601",
        "temperature_2m_max":"°C"},
        "daily":{"time":["2022-06-08"],
        "temperature_2m_max":[25.6]}
      });
  });

  beforeEach(() => {
    createExercise.mockReset();
    createExercise.mockResolvedValue({
      startTime: '2022-01-01 11:50',
      durationInSeconds: 60,
      activityType: 'running',
    });

    getExerciseById.mockResolvedValue({
      startTime: '2022-01-01 11:50',
      durationInSeconds: 60,
      activityType: 'running',
    });
  });

  it('should return 200 status code when posting exercise with valid data', async () => {
    const response = await request(app)
      .post('/exercise')
      .send(validExerciseData);
    expect(response.statusCode).toBe(200);
  });

  it('should return 200 status code when getting exercises', async () => {
    const response = await request(app)
      .get('/exercise')
    expect(response.statusCode).toBe(200);
  });

  it('should return content-type = json', async () => {
    const response = await request(app).post('/exercise');
    console.log(response.headers);
    expect(response.headers['content-type'].indexOf('json') > -1).toBeTruthy();
  });

  it('should return 400 status code if sending invalid post data', async () => {
    const response = await request(app).post('/exercise').send({
      startTime: '',
      durationInSeconds: 60,
      activityType: 'running',
    });
    expect(response.statusCode).toBe(400);
  });

  it('should call createExercise 1 time', async () => {
    const response = await request(app)
      .post('/exercise')
      .send(validExerciseData);
    expect(createExercise.mock.calls.length).toBe(1);
  });
});

describe('GET /exercise/:id', () => {
  it('should return a correct temperature', async () => {
    const response = await request(app).get(
      '/exercise/638f0496e8fb58228c5e6968'
    );
    expect(response.body.temperature).toBe(25.6);
  });

  it('should return 400 when id does not exist or invalid', async () => {
    const response = await request(app).get(
      '/exercise/hej'
    );
    console.log(response)
    expect(response.statusCode).toBe(400);
  });
});
