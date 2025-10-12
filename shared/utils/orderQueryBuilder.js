class OrderQueryBuilder {
    constructor(query, queryParams) {
        this.query = query;
        this.queryParams = queryParams;
        this.filters = {};
        this.sortOption = {};
        this.page = 1;
        this.limit = 10;
        this.skip = 0;
    }

    filter() {
        const { status, phone } = this.queryParams;
        
        if (status) {
            this.filters.status = status;
        }
        
        if (phone) {
            this.filters.customerPhone = { 
                $regex: phone, 
                $options: 'i' 
            };
        }
        
        return this;
    }

    dateRange() {
        const { startDate, endDate } = this.queryParams;
        
        if (startDate || endDate) {
            this.filters.createdAt = {};
            
            if (startDate) {
                this.filters.createdAt.$gte = new Date(startDate);
            }
            
            if (endDate) {
                this.filters.createdAt.$lte = new Date(endDate);
            }
        }
        
        return this;
    }

    search() {
        const { search } = this.queryParams;
        
        if (search) {
            this.filters.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { customerName: { $regex: search, $options: 'i' } },
                { customerPhone: { $regex: search, $options: 'i' } }
            ];
        }
        
        return this;
    }

    sort() {
        const { sort } = this.queryParams;
        
        const sortOptions = {
            'newest': { createdAt: -1 },
            'oldest': { createdAt: 1 },
            'amount_high': { totalAmount: -1 },
            'amount_low': { totalAmount: 1 }
        };
        
        this.sortOption = sortOptions[sort] || { createdAt: -1 };
        
        return this;
    }

    paginate() {
        const page = parseInt(this.queryParams.page) || 1;
        const limit = Math.min(parseInt(this.queryParams.limit) || 10, 100);
        
        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit;
        
        return this;
    }

    async execute() {
        const totalOrders = await this.query.model.countDocuments(this.filters);
        const orders = await this.query
            .find(this.filters)
            .sort(this.sortOption)
            .skip(this.skip)
            .limit(this.limit)
            .lean();
        
        const totalPages = Math.ceil(totalOrders / this.limit);
        return {
            orders,
            pagination: {
                currentPage: this.page,
                totalPages,
                totalOrders,
                limit: this.limit,
                hasNextPage: this.page < totalPages,
                hasPrevPage: this.page > 1
            }
        };
    }
}

module.exports = OrderQueryBuilder;