const { default: mongoose } = require("mongoose");
const ApiResponse =require("@utils/ApiResponse")
// validate id for params 
const validateId = (req,res,next) =>{
        const { id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return ApiResponse.error(res,"Invalid ID Format",null,400)
        }
        next()
}
module.exports = {validateId}