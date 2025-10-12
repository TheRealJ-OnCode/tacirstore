const ApiResponse = require("../../../../../shared/utils/ApiResponse")

const healthController = (req, res) => {
    return ApiResponse.success(res, "Store du qaas", { UPTIME: process.uptime() });
}
module.exports = { healthController }