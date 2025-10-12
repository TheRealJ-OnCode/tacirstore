const ApiResponse = require("../../../../../shared/utils/ApiResponse")

const healthController = (req, res) => {
    return ApiResponse.success(res, "Zordu qaas", { UPTIME: process.uptime() });
}
module.exports = { healthController }