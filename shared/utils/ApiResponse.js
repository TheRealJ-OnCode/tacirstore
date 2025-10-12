class ApiResponse {
    constructor(success, message, data = null, statusCode = 200) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    };
    static success(res, message, data=null, statusCode = 200) {
        res.status(statusCode).json(new ApiResponse(true, message, data, statusCode))
    }
    static error(res, message, data=null, statusCode = 500){
        res.status(statusCode).json(new ApiResponse(false, message, data, statusCode))

    }

}
module.exports = ApiResponse;