import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import unitService from "../../services/unitService";
import toast from "react-hot-toast";

const ProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [uploading, setUploading] = useState(false);
  // Form state
  const [formData, setFormData] = useState({
    product_name: "",
    product_company: "",
    product_category: "",
    product_description: "",
    product_images: [""],
    hasVariants: false,
    variantType: "Standart",
    isShippingFree: true,
    shippingCost: 0,
    product_unit: "",
  });

  // Sadə varyant (varyantsız məhsul üçün)
  const [singleVariant, setSingleVariant] = useState({
    skus: [""],
    product_sales_price: "",
    product_purchase_price: "",
    product_count: "",
    discountAmount: 0,
  });

  // Çoxlu varyantlar (varyantlı məhsul üçün)
  const [variants, setVariants] = useState([
    {
      variantName: "",
      skus: [""],
      product_sales_price: "",
      product_purchase_price: "",
      product_count: "",
      product_images: [""],
      discountAmount: 0,
    },
  ]);
  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        "https://tacirstore-copy-production.up.railway.app/api/admin/v1//upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        updateImage(index, data.url);
        toast.success("Şəkil yükləndi");
      }
    } catch (error) {
      toast.error("Xəta baş verdi");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, unitsRes] = await Promise.all([
        categoryService.getCategories(),
        unitService.getUnits(),
      ]);
      setCategories(categoriesRes.data || []);
      setUnits(unitsRes.data || []);
    } catch (error) {
      toast.error("Məlumatlar yüklənmədi");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.product_name || !formData.product_category) {
      toast.error("Zəruri sahələri doldurun");
      return;
    }

    try {
      setLoading(true);

      // Şəkilləri filtrələ (boş olanları sil)
      const filteredImages = formData.product_images.filter(
        (img) => img.trim() !== ""
      );

      const submitData = {
        ...formData,
        product_images: filteredImages,
      };

      if (!formData.hasVariants) {
        // Varyantsız məhsul
        const filteredSkus = singleVariant.skus.filter(
          (sku) => sku.trim() !== ""
        );
        submitData.variant = {
          ...singleVariant,
          skus: filteredSkus,
        };
      } else {
        // Varyantlı məhsul
        submitData.variants = variants.map((v) => ({
          ...v,
          skus: v.skus.filter((sku) => sku.trim() !== ""),
          product_images: v.product_images.filter((img) => img.trim() !== ""),
        }));
      }

      await productService.createProduct(submitData);
      toast.success("Məhsul yaradıldı");
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Şəkil əlavə et
  const addImage = () => {
    setFormData({
      ...formData,
      product_images: [...formData.product_images, ""],
    });
  };

  const removeImage = (index) => {
    const newImages = formData.product_images.filter((_, i) => i !== index);
    setFormData({ ...formData, product_images: newImages });
  };

  const updateImage = (index, value) => {
    const newImages = [...formData.product_images];
    newImages[index] = value;
    setFormData({ ...formData, product_images: newImages });
  };

  // SKU funksiyaları (sadə varyant üçün)
  const addSku = () => {
    setSingleVariant({ ...singleVariant, skus: [...singleVariant.skus, ""] });
  };

  const removeSku = (index) => {
    const newSkus = singleVariant.skus.filter((_, i) => i !== index);
    setSingleVariant({ ...singleVariant, skus: newSkus });
  };

  const updateSku = (index, value) => {
    const newSkus = [...singleVariant.skus];
    newSkus[index] = value;
    setSingleVariant({ ...singleVariant, skus: newSkus });
  };

  // Varyant əlavə et
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        variantName: "",
        skus: [""],
        product_sales_price: "",
        product_purchase_price: "",
        product_count: "",
        product_images: [""],
        discountAmount: 0,
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      toast.error("Ən azı 1 varyant olmalıdır");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  // Varyant SKU funksiyaları
  const addVariantSku = (variantIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].skus.push("");
    setVariants(newVariants);
  };

  const removeVariantSku = (variantIndex, skuIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].skus = newVariants[variantIndex].skus.filter(
      (_, i) => i !== skuIndex
    );
    setVariants(newVariants);
  };

  const updateVariantSku = (variantIndex, skuIndex, value) => {
    const newVariants = [...variants];
    newVariants[variantIndex].skus[skuIndex] = value;
    setVariants(newVariants);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/products")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Yeni Məhsul</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol tərəf - Əsas məlumatlar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Əsas məlumatlar */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Əsas Məlumatlar</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Məhsul Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Məsələn: Premium T-Shirt"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şirkət
                    </label>
                    <input
                      type="text"
                      value={formData.product_company}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product_company: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Məsələn: Zara"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kateqoriya *
                    </label>
                    <select
                      required
                      value={formData.product_category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product_category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçin...</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Təsvir
                  </label>
                  <textarea
                    rows="3"
                    value={formData.product_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        product_description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Məhsul haqqında qısa məlumat..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ölçü Vahidi
                  </label>
                  <select
                    value={formData.product_unit}
                    onChange={(e) =>
                      setFormData({ ...formData, product_unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Yoxdur</option>
                    {units.map((unit) => (
                      <option key={unit._id} value={unit._id}>
                        {unit.name} ({unit.conversionRate} {unit.baseUnit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Şəkillər */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Şəkillər</h3>
                <button
                  type="button"
                  onClick={addImage}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Şəkil Əlavə Et
                </button>
              </div>

              <div className="space-y-2">
                {formData.product_images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                      id={`image-${index}`}
                    />
                    <label
                      htmlFor={`image-${index}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center justify-center"
                    >
                      {uploading ? "Yüklənir..." : img || "Şəkil Seç"}
                    </label>
                    {img && (
                      <img
                        src={img}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    {formData.product_images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Varyant seçimi */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Varyantlar</h3>

              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!formData.hasVariants}
                    onChange={() =>
                      setFormData({ ...formData, hasVariants: false })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Varyantsız (tək məhsul)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.hasVariants}
                    onChange={() =>
                      setFormData({ ...formData, hasVariants: true })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Varyantlı (ölçü, rəng və s.)</span>
                </label>
              </div>

              {formData.hasVariants && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Varyant Tipi
                  </label>
                  <input
                    type="text"
                    value={formData.variantType}
                    onChange={(e) =>
                      setFormData({ ...formData, variantType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Məsələn: Beden, Rəng, Ölçü"
                  />
                </div>
              )}

              {!formData.hasVariants ? (
                // Varyantsız məhsul formu
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Məhsul Məlumatları</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barkodlar *
                    </label>
                    {singleVariant.skus.map((sku, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          required
                          value={sku}
                          onChange={(e) => updateSku(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Barkod..."
                        />
                        {singleVariant.skus.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSku(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSku}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Barkod əlavə et
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Satış Qiyməti (₼) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={singleVariant.product_sales_price}
                        onChange={(e) =>
                          setSingleVariant({
                            ...singleVariant,
                            product_sales_price: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alış Qiyməti (₼) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={singleVariant.product_purchase_price}
                        onChange={(e) =>
                          setSingleVariant({
                            ...singleVariant,
                            product_purchase_price: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stok *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={singleVariant.product_count}
                        onChange={(e) =>
                          setSingleVariant({
                            ...singleVariant,
                            product_count: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endirim (₼)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={singleVariant.discountAmount}
                        onChange={(e) =>
                          setSingleVariant({
                            ...singleVariant,
                            discountAmount: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Varyantlı məhsul formu
                <div className="space-y-4">
                  {variants.map((variant, variantIndex) => (
                    <div
                      key={variantIndex}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">
                          Varyant {variantIndex + 1}
                        </h4>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(variantIndex)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Varyant Adı *
                        </label>
                        <input
                          type="text"
                          required
                          value={variant.variantName}
                          onChange={(e) =>
                            updateVariant(
                              variantIndex,
                              "variantName",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Məsələn: M, L, XL"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Barkodlar *
                        </label>
                        {variant.skus.map((sku, skuIndex) => (
                          <div key={skuIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              required
                              value={sku}
                              onChange={(e) =>
                                updateVariantSku(
                                  variantIndex,
                                  skuIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Barkod..."
                            />
                            {variant.skus.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeVariantSku(variantIndex, skuIndex)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addVariantSku(variantIndex)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Barkod əlavə et
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Satış Qiyməti (₼) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={variant.product_sales_price}
                            onChange={(e) =>
                              updateVariant(
                                variantIndex,
                                "product_sales_price",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alış Qiyməti (₼) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={variant.product_purchase_price}
                            onChange={(e) =>
                              updateVariant(
                                variantIndex,
                                "product_purchase_price",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stok *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={variant.product_count}
                            onChange={(e) =>
                              updateVariant(
                                variantIndex,
                                "product_count",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Endirim (₼)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.discountAmount}
                            onChange={(e) =>
                              updateVariant(
                                variantIndex,
                                "discountAmount",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariant}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500"
                  >
                    + Varyant əlavə et
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sağ tərəf - Digər parametrlər */}
          <div className="space-y-6">
            {/* Çatdırılma */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Çatdırılma</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isShippingFree"
                    checked={formData.isShippingFree}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isShippingFree: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label
                    htmlFor="isShippingFree"
                    className="text-sm font-medium"
                  >
                    Pulsuz çatdırılma
                  </label>
                </div>

                {!formData.isShippingFree && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Çatdırılma Qiyməti (₼)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.shippingCost}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shippingCost: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Düymələr */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {loading ? "Yaradılır..." : "Məhsul Yarat"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Ləğv et
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
