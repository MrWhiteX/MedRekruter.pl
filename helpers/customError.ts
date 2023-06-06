interface CustomError extends Error {
  message: string;
}

export function isCustomError(error: unknown): error is CustomError {
  return typeof error === 'object' && error !== null && 'message' in error;
}
