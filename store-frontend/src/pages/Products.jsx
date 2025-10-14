import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import SEO from "../components/common/SEO";
import ProductCard from "../components/common/ProductCard";
import ProductFilters from "../components/product/ProductFilters";
import { getProducts, getCategories } from "../services/api";
import { Search, SlidersHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";
import SkeletonCard from "../components/common/SkeletonCard";
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, page, searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
      };

      if (searchParams.get("search"))
        params.search = searchParams.get("search");
      if (selectedCategory) params.category = selectedCategory;
      if (sortBy) params.sort = sortBy;

      const response = await getProducts(params);
      setProducts(response.data.data.products || []);
      setTotalPages(response.data.data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error("Məhsullar yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
      setPage(1);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("");
    setSearchParams({});
    setPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory || sortBy;

  return (
    <Layout>
      <SEO
        title="Məhsullar"
        description="Bütün məhsullarımızı kəşf edin. Keyfiyyətli məhsullar, sərfəli qiymətlər, sürətli çatdırılma."
        keywords="məhsullar, online alış-veriş, kateqoriyalar, endirim"
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Məhsullar
            </h1>

            {/* Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Məhsul axtar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-light rounded-lg transition-colors"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="">Sırala</option>
                <option value="-createdAt">Ən Yeni</option>
                <option value="createdAt">Ən Köhnə</option>
                <option value="product_name">A-Z</option>
                <option value="-product_name">Z-A</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold"
              >
                <SlidersHorizontal size={20} />
                <span>Filtrlər</span>
              </button>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Aktiv filtrlər:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                    Axtarış: {searchQuery}
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                    {categories.find((c) => c._id === selectedCategory)?.name}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-2 text-primary text-sm font-semibold hover:underline"
                >
                  Təmizlə
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside
              className={`lg:block ${
                showFilters ? "block" : "hidden"
              } fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto bg-black/50 lg:bg-transparent`}
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowFilters(false);
              }}
            >
              <div className="absolute lg:relative right-0 top-0 h-full w-80 lg:w-auto bg-white lg:bg-transparent p-6 lg:p-0 overflow-y-auto">
                {/* Mobile Close */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>

                <ProductFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">Məhsul tapılmadı</p>
                  <button
                    onClick={clearFilters}
                    className="text-primary font-semibold hover:underline"
                  >
                    Filtrləri təmizlə
                  </button>
                </div>
              ) : (
                <>
                  {/* Products */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Əvvəlki
                      </button>

                      <span className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
                        {page} / {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Növbəti
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
