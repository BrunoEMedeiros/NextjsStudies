// ApiError.ts
export class ApiError extends Error {
  status: number;
  data: {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
    code?: string;
  };

  constructor(
    status: number,
    data: {
      statusCode: number;
      timestamp: string;
      path: string;
      message: string;
      code?: string;
    }
  ) {
    super(data?.message || "Unknown error");
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
