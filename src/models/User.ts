import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    orders: [
      {
        items: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: 'Product',
            },
            quantity: { type: Number, default: 1 },
            priceAtPurchase: { type: Number, required: true },
          },
        ],
        totalAmount: { type: Number, required: true },
        status: {
          type: String,
          enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
          default: 'Pending',
        },
        orderDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);
export default User;
