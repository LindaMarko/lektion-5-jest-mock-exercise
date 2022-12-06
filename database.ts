import mongoose from 'mongoose';

type IExercise = {
  startTime: Date;
  durationInSeconds: Number;
  activityType: 'running' | 'walking' | 'biking';
};

const exerciseSchema = new mongoose.Schema<IExercise>({
  startTime: Date,
  durationInSeconds: Number,
  activityType: String,
});

const ExerciseModel = mongoose.model('exercise', exerciseSchema);

export const createExercise = async (exerciseData: IExercise) => {
  return await new ExerciseModel(exerciseData).save();
};

export const getExerciseById = async (id: string) => {
  return await ExerciseModel.findById(id);
};

export const getAllExercise = async (id: string) => {
  return await ExerciseModel.find();
};
