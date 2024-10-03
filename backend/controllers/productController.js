import Product from '../schema/productSchema.js';
import { addEmailToQueue } from '../utils/addmailtoqueue.js';
// import { Promise, Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { query } from 'express';
import Review from '../schema/reviewSchema.js';
import Users from '../schema/userSchema.js';
// import Brand from '../schema/brandSchema.js';
import RecentlyViewed from '../schema/recentlyViewedSchema.js';
import { setCache,getCache,deleteCache,updateCache, isRedisAlive } from '../utils/redis.js';
import Brand from '../schema/brandSchema.js';

import Favourites from '../schema/favouritesSchema.js';
// import { assign } from 'nodemailer/lib/shared/index.js';
// import Category from '../schema/categorySchema.js';
// import Product from '../schema/productSchema.js';



export const createProduct = async (req, res) => {

  
// console.log(req);
  const { name, coverImage, images,description, price, discount, origin,flavour ,stock,brandname,roastlevel} = req.body;
  try {
    
    // Find category and item type

    // Create new product
    const newProduct = new Product({
      name:name,
      coverImage: coverImage,
      images: images,  
      flavour: flavour,
      description:description,
      price:price,
      roastlevel:roastlevel,
      discount:discount,
      stock:stock,
      origin:origin,
      brandname:brandname,
    });
    const savedProduct = await newProduct.save();

    if(getCache != null){
      deleteCache('products');
    }
    
    return res.status(201).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating product', details: error.message });
  }
};

// export const createBrand = async (req, res) => {
//   // Correct the variable name for coffee_blends
//   const { name, proImage, discount, roasting_techniques, coffee_blends, social_links, contact_email, brandstory } = req.body;

//   // Validate required fields
//   if (!name || !proImage || !discount || !roasting_techniques || !contact_email) {
//     return res.status(400).json({ error: "Please fill in all the required details." });
//   }

//   try {
//     // Create a new brand document
//     const newBrand = new Brand({
//       name,
//       brandstory,
//       proImage,
//       discount,
//       roasting_techniques,
//       coffee_blends, // Ensure the array is passed correctly
//       contact_email,
//       social_links,
//     });

//     // Save the new brand to the database
//     await newBrand.save();

//     // Invalidate the cache for 'Brands' after a new brand is created
//     if (await getCache('Brands') != null) {
//       await deleteCache('Brands');
//     }

//     return res.status(200).json("Brand created successfully");
//   } catch (error) {
//     console.error("Error creating brand:", error);
//     return res.status(500).json({ error: "Server error occurred while creating the brand." });
//   }
// };
export const createBrand = async (req, res) => {
  const {
    name,
    proImage,
    discount,
    roasting_techniques,
    coffee_blends, // Default to empty array
    social_links, // Default to empty object
    contact_email,
    brandstory
  } = req.body;
  console.log(req.body)

  // Validation: Check required fields
  if (!name || !proImage || !discount || !roasting_techniques || !contact_email) {
    return res.status(400).json({ error: "Please fill in all the required details." });
  }

  try {
    const newBrand = new Brand({
      name,
      brandstory,
      proImage,
      discount,
      roasting_techniques,
      coffee_blends, // Ensure it's an array
      contact_email,
      social_links, // Ensure it's an object
    });

    await newBrand.save();

    if (await getCache('Brands') != null) {
      await deleteCache('Brands');
    }

    return res.status(200).json("Brand created successfully");
  } catch (error) {
    return res.status(500).json({ error: "Server error occurred while creating the brand." });
  }
};

// Get All Brands with caching logic

export const getProductsByBrand = async(req,res)=>{
  // console.log(req.body)
  const {brandname} = req.params;
  console.log(brandname)
  // console.log(brandname)
  try{
    const brand = await Brand.findOne({name:brandname});
    console.log(brand)
    if(!brand){
      return res.json({error:"brand not found"});
    }
    const products = await Product.find({brandname:brandname});
    console.log(products)
    const updatedProducts = products.map(product => {
      const updatedProduct = product.toObject();
      updatedProduct.price = updatedProduct.price * req.Currency;
      return updatedProduct;
  });
  console.log(updatedProducts)
  return res.status(200).json(updatedProducts);
  }
  catch(error){
    return res.json({error:error});
  }
}



export const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name,description, price, discount, imagesToDelete, newImages, coverImage ,brandname,origin,stock,flavour,roastlevel} = req.body;
  try {
    // Find the product by ID
    const product = await Product.findOne({ productId: Number(id) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Prepare updates object
    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (price) updates.price = price;
    if (discount) updates.discount = discount;
    if (coverImage) updates.coverImage = coverImage;
    if(stock)updates.stock=stock;
    if(roastlevel) updates.roastlevel = roastlevel;
    if(flavour) updates.flavour = flavour;
    if(origin) updates.origin = origin;
    if(brandname){
      const brand = await Brand.findOne({name:brandname});
      if(brand){
        updates.brandname = brandname;
      }
    }
    

   

    // Handle image deletion
    if (imagesToDelete && imagesToDelete.length > 0) {
      // Filter out images marked for deletion
      updates.images = product.images.filter(image => !imagesToDelete.includes(image));
    }

    // if(newsubcategories && newsubcategories.length > 0){
    //   updates.subcategories = [...product.subcategories,...newsubcategories];
    // }
    // Upload new images if any and add to the product's image array
    if (newImages && newImages.length > 0) {
      // Assuming newImages are URLs or identifiers for new images
      updates.images = [...product.images, ...newImages];
    }

    if (price || discount) {
      const updatedPrice = price || product.price;
      const updatedDiscount = discount || product.discount;
      updates.discountedPrice = updatedPrice - (updatedPrice * updatedDiscount) / 100;
    }

    // Apply updates to the product
    Object.assign(product, updates);
    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Error editing product', details: error.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    return res.status(200).json({
      products: products,
      total: total,
    });
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

export const getProductById = async(req,res)=>{
  try{
    const {id} = req.params;
    
    console.log("id",id);
    if (!id){
      return res.status(400).json({error:"id not found "});
    }
    console.log("abcd")
    const product = await Product.findOne({"productId":id});
    console.log("pqrst")
    if(!product){
      return res.status(400).json({error:"invalid product id"});
    }
    product.views+=1;
    await product.save();
    if(req.user){
      const abcd = await RecentlyViewed.createOrUpdate(req.user.email,product);
    }
    
   
    return res.status(200).json(product);
  }
  catch(e){
    return res.status(500).json(e);
  }
}


export const deleteProductByID = async(req,res)=>{
  try{
const id = req.params.id;
if(!id){
  return res.json({error:"id not found"});
}
console.log(id);
const prod = await Product.findOneAndDelete({productId:Number(id)});
return res.json({message:"product successfully deleted"});
  }
  catch(error){
    return res.json({error:"product not found"});
  }
}
export const sortPriceProduct = async(req, res) => {
  try {
    const { order, category } = req.body;
    let filters = {};
    
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) {
        filters.category = category;
      } else {
        return res.status(400).json({ error: "Invalid category" });
      }
    }
    
    let sortCriteria = {};
    if (order === 'asc') {
      sortCriteria.price = 1; // Ascending order
    } else if (order === 'desc') {
      sortCriteria.price = -1; // Descending order
    }
    
    const products = await Product.find(filters).sort(sortCriteria);
    
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




export const fetchProducts = async (req, res) => {
  const { brandname, minPrice, maxPrice, sortBy, orderBy } = req.query;

  // Construct the filter object
  const filter = {};
  if (brandname) {
    filter.category = brandname;
  }
  if (minPrice !== undefined) {
    filter.price = { ...filter.price, $gte: Number(minPrice) };
  }
  if (maxPrice !== undefined) {
    filter.price = { ...filter.price, $lte: Number(maxPrice) };
  }

  // Construct the sort object
  const sort = {};
  if (sortBy) {
    const sortOrder = orderBy && orderBy.toLowerCase() === 'desc' ? -1 : 1;
    sort[sortBy] = sortOrder;
  }
  console.log(filter)

  try {
    const products = await Product.find().sort(sort);
    console.log(products)
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//review 
export const createReview= async (req,res)=>{

  const {productId,text,rating} = req.body;
  
  if(!productId){
    return res.json({error:"missing values "})
  }
  console.log(productId)
  try{
    const user = await Users.findOne({email:req.user.email});
    if(!user){
      return res.status(400).json({error:"user not found"});
    }
    console.log(user.email)
   
    const prod = await Product.findOne({productId:productId});
    console.log(prod)
    if(!prod){
      return res.status(400).json({error:"product not found"});
    }
    // const ratings = Review.find({productId:productId})

    const rev = new Review({
      email:req.user.email,
      productId:productId,
      text:text,
      rating:rating
    });
    const review = await rev.save();
    console.log(review)
    return res.status(200).json({"message":"sucessfully created"});
  }
  catch(Error){
    res.status(500).json({error:Error.message});
  }
}

export const deleteReview = async(req,res)=>{
  const {email,productId,id} = req.body;
  console.log(req.body)
  if(!email || !productId){
    return res.status(404).json({error:"missing details"});
  }

  try{
    const user = await Users.findOne({email:email});
    if(!user){
      return res.status(400).json({error:"user not found"});
    }
    if (req.user.email !== user.email && req.user.userGroup !== "admin") {
      return res.status(403).json({ error: "forbidden" });
    }
    
    const product = await Product.findOne({productId:productId});
    if(!product){
      return res.status(400).json({error:"product not found"});
    }
    const rev = await Review.findOneAndDelete({_id:id,email:email,productId:productId});
    return res.status(200).json({message:"Review Deleted SucessFully"});
  }
  catch(error){
    return res.status(500).json({error:error});
  }
}

export const editReview = async (req,res)=>{
  const {email,productId,text,rating ,id} = req.body;
  
  console.log(req.body);
  if(!email || !productId){
    return res.json({error:"missing values "})
  }
  try{

    let updates={};
    if(text) updates.text = text;
    if(rating) updates.rating = rating;
    const user = await Users.findOne({email:email});
    if(!user){
      return res.status(400).json({error:"user not found"});
    }
    if (req.user.email !== user.email && req.user.userGroup !== "admin") {
      return res.status(403).json({ error: "forbidden" });
    }
    console.log(user.email);
    const prod = await Product.findOne({productId:productId});
    console.log(prod)
    if(!prod){
      return res.status(400).json({error:"product not found"});
    }

    const rev = await Review.findByIdAndUpdate(id,updates);
    console.log(rev)
    return res.status(200).json({message:"sucessfully updated"});
  }
  catch(Error){
    res.status(500).json({error:Error});
  }
}

export const deleteComment = async(req,res)=>{
  const {email,productId} = req.body;
  
  if(!email || !productId){
    return res.status(404).json({error:"missing details"});
  }

  try{
    const user = await Users.findOne({email:email});
    if(!user){
      return res.status(400).json({error:"user not found"});
    }
    if(req.user !== user && req.user.role!=="admin" ){
      return res.status(400).json({error:"forbidden"});
    }
    const product = await Product.findOne({productId:productId});
    if(!product){
      return res.status(400).json({error:"product not found"});
    }
    const rew = await Review.findOneAndUpdate({email:email,productId:productId},{text:""})
    return res.status(200).json({message:"comment deleted sucessfully"});
  }
  catch(Error){
    return res.status(500).json({error:Error});
  }

}

export const getReviewByUser = async(req,res)=>{
  const {productId} = req.body;
   
  if( !productId){
    return res.status(404).json({error:"missing details"});
  }

  try{
    
    if(req.user  ||  req.user.role!=="admin" ){
      return res.status(400).json({error:"forbidden"});
    }
    const product = await Product.findOne({productId:productId});
    if(!product){
      return res.status(400).json({error:"product not found"});
    }
    const review = await Review.findOne({email:req.user.email,productId:productId})
    return res.status(200).json({review});
  }
  catch(Error){
    return res.status(500).json({error:Error});
  }
}

// get reviews by product

export const getReviewsByProduct = async(req,res)=>{
  const p = req.params.productId;
  console.log(p)
 const productId = Number(p);
  if(!productId){
    return res.status(400).json({error:"product id not found"});
  }
  try{
    const review = await Review.find({productId:productId});
    if(!review){
      return res.status(200).json({error:"no comments to load"});
    }
    return res.status(200).json({review});
  }
  catch(error){
    return res.status(500).json({error});
  }
} 

// edit comment
export const editComment = async(req,res)=>{
  const {productId} = req.params;
  const {rating , comment} = req.body;
  if(!productId) return res.status(400).json({error:"product id not found"});
  try{
    const updates = {};
    if(rating){
      updates[rating] = rating;
    }
    if(comment){
      updates[comment]= comment;
    }
    const product=  await Product.findOne({productId:productId});
    if(!product){
      return res.status(400).json({error:"product not found"});
    }
    const review = await Review.findOneAndUpdate({email:req.user.email,productId:productId});
    if(!review){
      return res.status(400).json({error:"no comments exist assocaited with user"});
    }
    return res.status(200).json({message:"Review edited sucessfully"});
  }
  catch(error){
    return res.status(500).json({error});
  }
}



export const getAllBrands = async (req, res) => {
  try {
    // Check if Redis is available
    if (await isRedisAlive()) {
      // Check if the cache exists for 'Brands'
      const cachedBrands = await getCache('Brands');
      if (cachedBrands != null) {
        return res.status(200).json(cachedBrands);
      } else {
        // If cache is not found, fetch from the database
        const brands = await Brand.find();
        console.log(brands);
        await setCache('Brands', brands); // Set the cache with the fetched data
        return res.status(200).json(brands);
      }
    } else {
      // If Redis is not available, fetch directly from the database
      const brands = await Brand.find();
      console.log(brands);
      return res.status(200).json(brands);
    }
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(500).json({ error: "Server error occurred while fetching the brands." });
  }
};

export const editBrand = async (req, res) => {
  let { brandname, brandstory,roasting_techniques,coffe_blends,social_links,contact_email, newbrandname, proImage, discount } = req.body;
  const updates = {};

  try {

    if (await isRedisAlive()) {
      const cachedBrands = await getCache('Brands');
      if (cachedBrands != null) {
        await deleteCache('Brands');
      }
    }
    if (brandname && newbrandname) {
      const products = await Product.find({ brandname: brandname });

      const B = await Brand.findOneAndUpdate({ name: brandname }, { name: newbrandname });
      
      if (!B) {
        return res.json({ error: "Brand not found" });
      }
      brandname=newbrandname;

      if (products.length > 0) {
        const updatedProducts = await Promise.all(
          products.map(async product => {
            product.brandname = newbrandname;
            await product.save();
            return product;
          })
        );
      }

      brandname = newbrandname;
    }

    const brand = await Brand.findOne({ name: brandname });
    if (!brand) {
      return res.json({ error: "Brand not found" });
    }

    if (proImage) updates.proImage = proImage;
    if (discount) updates.discount = discount;
    if(brandstory)updates.brandstory = brandstory;
    if(roasting_techniques) updates.roasting_techniques = roasting_techniques;
    if(coffe_blends) updates.coffe_blends = coffe_blends;
    if(social_links) updates.social_links = social_links;
    if(contact_email) updates.contact_email = contact_email;

    const updatedBrand = await Brand.findOneAndUpdate({ name: brandname }, updates);

    return res.json({ message: "Products are updated successfully", updatedBrand });
  } catch (error) {
    return res.json({ error: error.message });
  }
};


export const deleteBrand = async (req, res) => {
  console.log("Received request to delete brand");
  const { brandname } = req.body;

  if (!brandname) {
    console.log("Brand name not provided");
    return res.status(400).json({ message: 'Brand name is required' });
  }

  try {
    if (await isRedisAlive()) {
      const cachedBrands = await getCache('Brands');
      if (cachedBrands != null) {
        await deleteCache('Brands');
      }
    }
    const brand = await Brand.findOneAndDelete({ name: brandname });

    if (brand) {
      console.log("Brand found and deleted:", brandname);
      const products = await Product.find({ brandname: brandname });
      console.log("Products associated with the brand:", products.length);

      const deletedProducts = await Promise.all(products.map(async product => {
        await product.deleteOne();
        return product.productId; // Returning the ID of the deleted product
      }));

      console.log("All associated products deleted");

      return res.status(200).json({
        message: 'Brand and its products deleted successfully',
        deletedProducts: deletedProducts,
      });
    } else {
      console.log("Brand not found:", brandname);
      return res.status(404).json({ message: 'Brand not found' });
    }
  } catch (error) {
    console.log("Error occurred during deletion:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// export const RecentlyViewedProducts = async(req,res)=>{
//   try{

//   }
// }



export const getallroles = async(req,res)=>{
  try{

  }
  catch(error){

  }
}




export const getBrandByName = async(req,res)=>{
  const {name} = req.params;
  try{
    const brand = await Brand.findOne({name:name});
    if(!brand){
      return res.json({error:"brand not found"});
    }
    return res.json(brand);
  }
  catch{
    return res.json({error:"catched error"});
  }
}




export const AddAndRemoveFavourites = async(req,res)=>{
  const {productId} = req.params;
  console.log("Hellow major")
  if(!productId)return res.json({error:"product Id not found"});
  try{
    console.log("hello surya");
   let message =  await Favourites.AddandDelete(req.user.email,productId);
   console.log(message);
   console.log("hello surya")
   return res.json({message:message})

  }
  catch(error){
    return res.status(500).json({"error":error.message});
  }
}

export const addToFav = async (req, res) => {
  const { productId } = req.body;
  
  try {
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Assuming req.user.email is available from your verifyAuthToken middleware
    const pr = await Favourites.addToFavourites(req.user.email, productId);

    return res.status(200).json({ message: "Product added to favourites" });
  } catch (error) {
    if (error.message.includes("Invalid Product Id")) {
      return res.status(400).json({ error: "Invalid Product ID" });
    } else if (error.message.includes("Product already in favourites")) {
      return res.status(409).json({ error: "Product is already in favourites" });
    } else {
      // For other unexpected errors, use 500 status code
      return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
  }
};

export const remToFav = async(req,res)=>{
  const {productId} = req.body;
  try{
    const pr = await Favourites.removeFromFavourites(req.user.email,productId);
    return res.status(200).json({message:"product removed"})
  }
  catch(error){
    return res.status(500).json({error:error.message});
  }
}



export const FavouriteProducts = async (req, res) => {
  try {
      const fav = await Favourites.findOne({ email: req.user.email });
      if (!fav || !fav.products.length) {
          return res.status(200).json({ products:null });
      }

      // Fetch the product details for each product ID in the favourites
      const products = await Promise.all(fav.products.map(async (productId) => {
          const product = await Product.findOne({productId:productId});
          return product;
      }));

      res.status(200).json({products });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// export const filters = async (req, res) => {
//   try {
//     const {
//       search,
//       minPrice,
//       maxPrice,
//       rating,
//       brand,
//       minDiscount,
//       maxDiscount,
//       hotDeals,
//       sortBy,
//       order
//     } = req.query;
//     console.log(req.query);
//     let filter = {};
//     if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
//     if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
//     if (rating) filter.rating = { $gte: Number(rating) };
//     if (brand) filter.brandname = brand;
//     if (minDiscount) filter.discount = { ...filter.discount, $gte: Number(minDiscount) };
//     if (maxDiscount) filter.discount = { ...filter.discount, $lte: Number(maxDiscount) };
//     if (hotDeals && hotDeals !== 'false') filter.hotDeals = true;

//     let sort = {};


//     if (sortBy) sort[sortBy] = order === 'desc' ? -1 : 1;
//     // console.log(filter);
//     let products;
//     if(search)
//     {
//       const regex = new RegExp(search, 'i'); // 'i' makes it case-insensitive
//        products = await Product.find({
//         $or: [
//           { name: regex },
//           { description: regex },
//           { brandname: regex },
//           {origin:regex},
//           {flavour:regex},
//           {roastlevel:regex},
//         ]
//       }).find(filter).sort(sort);
//     }
//     else{
//      products = await Product.find(filter).sort(sort);
//   }
  

//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
export const filters = async (req, res) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      rating,
      brand,
      minDiscount,
      maxDiscount,
      hotDeals,
      sortBy,
      order
    } = req.query;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    let filter = {};
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (rating) filter.rating = { $gte: Number(rating) };
    if (brand) filter.brandname = brand;
    if (minDiscount) filter.discount = { ...filter.discount, $gte: Number(minDiscount) };
    if (maxDiscount) filter.discount = { ...filter.discount, $lte: Number(maxDiscount) };
    if (hotDeals && hotDeals !== 'false') filter.hotDeals = true;

    let sort = {};
    if (sortBy) sort[sortBy] = order === 'desc' ? -1 : 1;

    let products;
    if (search) {
      const regex = new RegExp(search, 'i'); // 'i' makes it case-insensitive
      products = await Product.find({
        $or: [
          { name: regex },
          { description: regex },
          { brandname: regex },
          { origin: regex },
          { flavour: regex },
          { roastlevel: regex },
        ]
      }).find(filter).sort(sort).skip(skip).limit(limit);
    } else {
      products = await Product.find(filter).sort(sort).skip(skip).limit(limit);
    }

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const searchProducts = async (searchTerm) => {
  try {
    const regex = new RegExp(searchTerm, 'i'); // 'i' makes it case-insensitive
    const results = await Product.find({
      $or: [
        { name: regex },
        { flavour: regex },
        {origin:regex},
        { subcategories: regex },
        { description: regex },
        { brandname: regex },
        {roastlevel:regex},
      ]
    });
    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};


export const search =  async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).send('Query parameter "q" is required');
  }
  try {
    const products = await searchProducts(q);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for products' });
  }
};

export const generateRecommendedProducts = async (req,res) => {
  try {
    // Extract user preferences
    const { roast_level, origin } = req.user.preferences || {};

    // Build query based on preferences if they exist
    let query = {};
    if (roast_level) query.roastlevel = roast_level;
    if (origin) query.origin = origin;

    let recommendedProducts;

    // If user has no preferences, fetch popular products (sorted by rating, views, or purchases)
    if (!roast_level && !origin) {
      recommendedProducts = await Product.find()
        .sort({ rating: -1, views: -1, purchases: -1 }) // Sort by highest rating, views, and purchases
        .limit(3); // Default top 10 popular products
    } else {
      
      recommendedProducts = await Product.find(query)
        .sort({ rating: -1, views: -1, purchases: -1 }) // Sort by highest rating, views, and purchases
        .limit(3); // Limit the number of recommendations
    }
    if (recommendedProducts.length === 0) {
      return await Product.find()
        .sort({ rating: -1, views: -1, purchases: -1 }) // Sort by highest rating, views, and purchases
        .limit(3); // Fallback to top 10 products
    }

    return res.status(200).json({products:recommendedProducts});
  } catch(error){
    return res.status(500).json({error:error.message});
  }
};

export const getTopProducts = async(req,res)=>{
  try{
    const topproducts = await Product.find()
    .sort({ rating: -1, views: -1, purchases: -1 }) // Sort by highest rating, views, and purchases
    .limit(3);
    return res.status(200).json({products:topproducts});
  }
  catch(error){
    return res.status(500).json({error:error.message});
  }
}