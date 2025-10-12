const ApiResponse = require("../utils/ApiResponse");

const errorHandler = (err,req,res,next)=>{
    console.error(`[ERROR] ${err.stack}`);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"
    return ApiResponse.error(res,message,null,statusCode)
}
module.exports = errorHandler;