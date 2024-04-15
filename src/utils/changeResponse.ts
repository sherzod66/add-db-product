export const changeResponse = (
  success: boolean,
  data: any,
  error: any = null
) => ({
  success,
  data,
  error,
});
