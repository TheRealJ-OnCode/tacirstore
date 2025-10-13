const ProductFilters = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Kateqoriyalar</h3>

      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === ''
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-light'
          }`}
        >
          Hamısı
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category._id)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category._id
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-light'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilters;