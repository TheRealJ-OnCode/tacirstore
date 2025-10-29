const ApiResponse = require("../utils/ApiResponse");
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return ApiResponse.error(res, "Validation failed", errors, 400);
        }

        req.body = value;
        next();
    };
};

module.exports = validate;