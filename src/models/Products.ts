import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    sku: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    availability: { type: String, required: true },
    imageUrl: { type: String, required: true },
    badge: { type: String, enum: ['HOT', 'BEST DEALS', null], default: null },
  },
  { timestamps: true }
);

const Product = models.Product || model('Product', ProductSchema);
export default Product;
