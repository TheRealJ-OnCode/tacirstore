import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Package } from "lucide-react";
import productService from "../../services/productService";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      setProduct(response.data.product);
      setVariants(response.data.variants || []);
    } catch (error) {
      toast.error("Məhsul yüklənmədi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Yüklənir...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">Məhsul tapılmadı</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/products")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Məhsul Detalları</h1>
        </div>
        <button
          onClick={() => navigate(`/products/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit size={20} />
          Düzəliş et
        </button>
      </div>

      {/* Məhsul Məlumatları */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sol tərəf - Şəkillər */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Şəkillər</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.product_images && product.product_images.length > 0 ? (
                product.product_images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={product.product_name}
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                ))
              ) : (
                <div className="col-span-2 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package size={48} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Sağ tərəf - Məlumatlar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Əsas Məlumatlar</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Məhsul Adı</label>
                <p className="text-lg font-medium">{product.product_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Şirkət</label>
                <p className="text-lg">{product.product_company}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Təsvir</label>
                <p className="text-gray-700">
                  {product.product_description || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Çatdırılma</label>
                  <p className="text-lg">
                    {product.isShippingFree ? (
                      <span className="text-green-600">Pulsuz</span>
                    ) : (
                      <span>{product.shippingCost} ₼</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Aktiv" : "Deaktiv"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Varyantlar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Varyantlar ({variants.length})
        </h3>

        {variants.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Varyant yoxdur</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Varyant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Barkodlar
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Satış Qiyməti
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Alış Qiyməti
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stok
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Endirim
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Satış Sayı
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {variants.map((variant) => (
                  <tr key={variant._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {variant.variantName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {variant.skus?.map((sku, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-xs rounded"
                          >
                            {sku}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {variant.product_sales_price} ₼
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {variant.product_purchase_price} ₼
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-medium ${
                          variant.product_count > 10
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {variant.product_count}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {variant.discountAmount > 0 ? (
                        <span className="text-red-600">
                          -{variant.discountAmount} ₼
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {variant.salesCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
