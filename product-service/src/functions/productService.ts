import { Client } from 'pg';
import type { QueryConfig } from 'pg';
import { NewProduct, Product } from './typings';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD
};

class ProductService {
    private client: Client = null;
    private productTableName = 'products';
    private stockTableName = 'stocks';

    public getProducts = async (): Promise<Product[]> => {
      await this.initConnection();

      const { rows: products = [] } = await this.client.query(
        `select id, title, description, price, count from ${this.productTableName} p
          left join stocks s on p.id = s.product_id`)
        .finally(() => { this.client.end(); console.log('end db connection'); });
      return products;
    }

    public getProductById = async (id: string): Promise<Product> => {
      await this.initConnection();
      const query = {
        text: `select id, title, description, price, count from ${this.productTableName} p
          left join stocks s on p.id = s.product_id
          where id = $1`,
        values: [id],
      } as QueryConfig;

      const { rows: products = [] } = await this.client.query(query)
        .finally(() => { this.client.end(); console.log('end db connection'); });

      return products[0];
    }

    public createProduct = async (product: NewProduct): Promise<Product> => {
      await this.initConnection();

      try {
        await this.client.query('BEGIN')

        const productQuery = {
          text: `INSERT INTO ${this.productTableName}(title, description, price)
            VALUES($1, $2, $3)
            RETURNING *`,
          values: [ product.title, product.description, product.price ]
        } as QueryConfig;
        const { rows: [{ id }] } = await this.client.query(productQuery);

        const stockQuery = {
          text: `INSERT INTO ${this.stockTableName}(product_id, count)
            VALUES($1, $2)`,
          values: [ id, product.count ]
        } as QueryConfig;
        await this.client.query(stockQuery);

        await this.client.query('COMMIT');

        return { id, ...product };
      } catch (error) {
        await this.client.query('ROLLBACK');
        throw error;
      } finally {
        this.client.end();
        console.log('end db connection');
      }
    }

    private initConnection = async () => {
      this.client = new Client(dbOptions);
      console.log('start db connection');
      await this.client.connect();
    }
}

const productService = new ProductService();

export default productService;
