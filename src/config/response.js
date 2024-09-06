export const responseData = (data, message, status, res) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};
