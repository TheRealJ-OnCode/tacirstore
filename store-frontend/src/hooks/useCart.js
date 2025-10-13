import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (variant, product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(item => item.variantId === variant._id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.variantId === variant._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                variantId: variant._id,
                productName: product.product_name,
                variantName: variant.variantName,
                price: variant.product_sales_price - (variant.discountAmount || 0),
                image: variant.product_images?.[0] || product.product_images?.[0],
                quantity,
                stock: variant.product_count,
              },
            ],
          });
        }
      },
      
      removeItem: (variantId) => {
        set({ items: get().items.filter(item => item.variantId !== variantId) });
      },
      
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);