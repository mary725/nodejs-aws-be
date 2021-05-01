import type { FromSchema } from 'json-schema-to-ts';
import productList from './productList.mock.json';
import { productSchema } from './typings';

type Product = FromSchema<typeof productSchema>;

class ProductService {
    private productList: Product[] = productList;

    public get Products() {
      return this.productList;
    }

    public getProductById = async (id: string) => {
      const product = this.productList.find(product => product.id === id);
      return new Promise((resolve) => {
          setTimeout(() => {
            resolve(product);
          }, 300);
        });
    }
}

const productService = new ProductService();

export default productService;
