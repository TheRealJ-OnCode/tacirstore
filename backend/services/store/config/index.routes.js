//All routes exports from this file
const router = require("express").Router();
// router.use(require("../modules/health/health.routes"));
router.use(require("../modules/category/category.routes"));
router.use(require("../modules/order/order.routes"));
router.use(require("../modules/product/product.routes"));

module.exports = router;