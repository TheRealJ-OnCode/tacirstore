const asyncHandler = require("express-async-handler");
const ApiResponse = require("@utils/ApiResponse");
const { Product, Order, Variant } = require("@models");

const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Toplam məhsul sayı
    const totalProducts = await Product.countDocuments({ isActive: true });

    // 2. Toplam sipariş sayı
    const totalOrders = await Order.countDocuments();

    // 3. Bu ayın gəliri
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfMonth },
                status: { $in: ['confirmed', 'shipped', 'delivered'] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalAmount" }
            }
        }
    ]);

    const thisMonthRevenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;

    // 4. Pending siparişlər
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // 5. Status breakdown
    const statusBreakdown = await Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // 6. Son 5 sipariş
    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber customerName totalAmount status createdAt');

    // 7. Ən çox satılan 5 məhsul (variant'a görə)
    const topProducts = await Variant.find()
        .populate('productId', 'product_name product_company')
        .sort({ salesCount: -1 })
        .limit(5)
        .select('variantName salesCount product_sales_price productId');

    // 8. Bu həftənin gəliri
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyRevenue = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfWeek },
                status: { $in: ['confirmed', 'shipped', 'delivered'] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalAmount" }
            }
        }
    ]);

    const thisWeekRevenue = weeklyRevenue.length > 0 ? weeklyRevenue[0].total : 0;

    // 9. Bu günün gəliri
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const dailyRevenue = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfDay },
                status: { $in: ['confirmed', 'shipped', 'delivered'] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalAmount" }
            }
        }
    ]);

    const todayRevenue = dailyRevenue.length > 0 ? dailyRevenue[0].total : 0;

    return ApiResponse.success(res, "Dashboard stats fetched", {
        stats: {
            totalProducts,
            totalOrders,
            thisMonthRevenue,
            thisWeekRevenue,
            todayRevenue,
            pendingOrders
        },
        statusBreakdown,
        recentOrders,
        topProducts
    });
});

module.exports = { getDashboardStats };