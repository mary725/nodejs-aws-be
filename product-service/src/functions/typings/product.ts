import type { FromSchema } from 'json-schema-to-ts';
import productSchema from './productSchema';
import newProductSchema from './newProductSchema';

export type Product = Pick<FromSchema<typeof productSchema>, 'id' | 'count' | 'title' | 'description' | 'price'>;

export type NewProduct = Pick<FromSchema<typeof newProductSchema>, 'count' | 'title' | 'description' | 'price'>;
