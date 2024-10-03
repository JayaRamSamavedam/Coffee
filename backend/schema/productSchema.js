import mongoose from 'mongoose';
import Counter from './productCounterSchema.js';
import Brand from './brandSchema.js';
const productSchema = new mongoose.Schema({
  brandname:{
    type:String,
  },
  productId: {
    type: Number,
    unique: true, // Ensure unique product IDs
  },
  name: {
    type: String, 
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default:0,
  },
  discountedPrice: {
    type: Number,
    default: function () {
      if(this.discount!==0)
      return this.price - (this.price * this.discount / 100);
    else 
    return this.price;
    },
  },
  views:{
    type:Number,
    default:0,
  },
  purchases:{
    type:Number,
    default:0,
  },
  stock:{
    type:Number,
    required:true
  },
  origin:{
    type:String,
    required:true,
  },
  flavour:{
    type:String,
    required:true,
  },
  roastlevel:{
    type:String,
    required:true,
  },
  rating:{
    type:Number,
    default:5,
  }
},{timestamps:true});

productSchema.index({ 
  name: 'text', 
  flavour: 'text', 
  origin: 'text', 
  description: 'text', 
  brandname: 'text' ,
  roastlevel: 'text',
});

productSchema.pre('save', async function (next) {
  const product = this;
  if (!product.isNew) {
    return next();
  }
  try {
   
    const brand = await Brand.findOne({name:product.brandname});
    if(!brand){
      throw new Error("brand is invalid");
    }
    // const subcat = await SubcategorySchema.find({category:product.category});
    const counter = await Counter.findOneAndUpdate(
      { _id: 'productId' }, 
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    product.productId = counter.seq;
    next();
  } catch (error) {
    console.error("Error generating product ID:", error);
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
