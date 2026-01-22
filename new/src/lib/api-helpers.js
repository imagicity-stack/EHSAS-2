export const sendError = (res, error, fallbackStatus = 500) => {
  const status = error.statusCode || fallbackStatus;
  res.status(status).json({ detail: error.message || "Request failed" });
};
