/* 
This class is used to create a standard format for successful responses in an API — just like ApiError was used for error responses.
*/

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
