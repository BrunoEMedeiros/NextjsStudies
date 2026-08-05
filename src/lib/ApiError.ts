// ApiError.ts
type ApiErrorData = {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  code?: string;
};

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(status: number, data: Partial<ApiErrorData> | null) {
    const message = data?.message || "Erro inesperado. Tente novamente.";
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = {
      statusCode: data?.statusCode ?? status,
      timestamp: data?.timestamp ?? new Date().toISOString(),
      path: data?.path ?? "",
      message,
      code: data?.code,
    };
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
