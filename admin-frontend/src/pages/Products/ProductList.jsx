import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import productService from "../../services/productService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Məhsulları yüklə
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        search,
        page: 1,
        limit: 10,
      });
      setProducts(response.data.products || []);
    } catch (error) {
      toast.error("Məhsullar yüklənmədi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Məhsulu silmək istədiyinizdən əminsiniz?")) return;

    try {
      await productService.deleteProduct(id);
      toast.success("Məhsul silindi");
      fetchProducts(); // Yenilə
    } catch (error) {
      console.log(error);
      toast.error("Xəta baş verdi");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Məhsullar</h1>
        <button
          onClick={() => navigate("/products/create")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Yeni Məhsul
        </button>
      </div>

      {/* Axtarış */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Məhsul axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && fetchProducts()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={fetchProducts}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Axtar
        </button>
      </div>

      {/* Cədvəl */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Şəkil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Məhsul Adı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Şirkət
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Qiymət
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Əməliyyatlar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Məhsul tapılmadı
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={product.product_images?.[0] || "/placeholder.png"}
                      alt={product.product_name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.product_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {product.product_company}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.product_sales_price} ₼
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Aktiv" : "Deaktiv"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/products/${product._id}/edit`)
                        }
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
