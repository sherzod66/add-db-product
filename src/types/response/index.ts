export type ErrorResponse = {
  error: true;
  code: number;
  message: string;
  payload?: Record<string, any>;
};

export type ExerciseRequestBody = {
  title: string;
  image: string;
  video: string;
  description: string;
  metadescription: string;
};
