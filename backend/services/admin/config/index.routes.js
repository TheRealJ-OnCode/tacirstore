//All routes exports from this file
const router = require("express").Router();
router.use(require("../modules/health/health.routes"));
router.use(require("../modules/product/product.routes"));
router.use(require("../modules/order/order.routes"));
router.use(require("../modules/category/category.routes"));
router.use(require("../modules/unit/unit.routes"));
router.use(require("../modules/upload/upload.routes"));
router.use(require("../modules/dashboard/dashboard.routes"));
module.exports = router;