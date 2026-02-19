// ApiError.ts
export class ApiError extends Error {
  status: number;
  data: {
    statusCode: number;
    timestamp: string;
    path: string;
    message: string;
    // include any other fields your API might return
  };

  constructor(status: number, data: any) {
    super(data?.message || "Unknown error");
    this.name = "ApiError";
    this.status = status;
    this.data = data;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Type guard (optional – you can also use `instanceof` directly)
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
