import type { Category } from '../../types/category';
import { mockCategories } from '../../mock/categories';

/**
 * CategoryService
 * Today: returns mock categories. Later: replaces with Axios.
 */
const categoryService = {
  async getAll(): Promise<Category[]> {
    await new Promise<void>((r) => setTimeout(r, 300));
    return mockCategories;
  },

  async getById(id: string): Promise<Category | undefined> {
    await new Promise<void>((r) => setTimeout(r, 200));
    return mockCategories.find((c) => c.id === id);
  },
};

export default categoryService;
