class QueryBuilder {
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
        const { category, company, isActive } = this.queryParams;
        
        if (category) {
            this.filters.product_category = category;  
        }
        
        if (company) {
            this.filters.product_company = company;  
        }
        
        if (isActive !== undefined) {
            this.filters.isActive = isActive === 'true';  
        } else {
            this.filters.isActive = true;  
        }
        
        return this;
    }

    search() {
        const { search } = this.queryParams;
        
        if (search) {
            this.filters.product_name = {  
                $regex: search, 
                $options: 'i'
            };
        }
        
        return this;
    }

    sort() {
        const { sort } = this.queryParams;
        
        const sortOptions = {
            'price_asc': { product_sales_price: 1 },
            'price_desc': { product_sales_price: -1 },
            'name_asc': { product_name: 1 },
            'name_desc': { product_name: -1 },
            'newest': { createdAt: -1 },
            'oldest': { createdAt: 1 }
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
        const totalProducts = await this.query.model.countDocuments(this.filters);  
        
        const products = await this.query
            .find(this.filters)  
            .sort(this.sortOption)
            .skip(this.skip)
            .limit(this.limit)
            .lean();
        
        const totalPages = Math.ceil(totalProducts / this.limit);
        
        return {
            products,
            pagination: {
                currentPage: this.page,
                totalPages,
                totalProducts,
                limit: this.limit,
                hasNextPage: this.page < totalPages,
                hasPrevPage: this.page > 1
            }
        };
    }
}

module.exports = QueryBuilder;