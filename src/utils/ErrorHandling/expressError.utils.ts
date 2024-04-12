class ExpressError extends Error {
  status: number;
  error: string;
  errorDev: string;
  constructor(status: number, error: string, errorDev: string = '') {
    super();
    this.status = status;
    this.error = error;
    this.errorDev = errorDev;
  }
}

export default ExpressError;
