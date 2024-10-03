import mongoose from "mongoose";
import Product from "./productSchema.js";
const favouritesSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    products:{
        type:[Number],
    }
});
// Add a product to the favourites
favouritesSchema.statics.addToFavourites = async function(email, productId) {
    try {
        console.log(productId);

        // Find the favourites list for the user by email
        let favourites = await this.findOne({ email });

        // If no favourites exist for the user, create a new favourites list
        if (!favourites) {
            favourites = new this({ email, products: [productId] });
        } else {
            // Check if the product is already in the favourites list
            if (favourites.products.includes(Number(productId))) {
                return favourites;
            }

            // Check if the product exists in the Product collection
            const product = await Product.findOne({ productId: productId });
            if (product) {
                // Add the product to the favourites list
                favourites.products.push(Number(productId));
            } else {
                throw new Error("Invalid Product Id");
            }
        }

        // Save the updated favourites list
        await favourites.save();
        return favourites;
    } catch (error) {
        throw new Error('Error in adding to favourites: ' + error.message);
    }
};


favouritesSchema.statics.AddandDelete = async function(email, productId) {
    console.log("I have been called");
    let message = "";
    try {
        let favourites = await this.findOne({ email });
        if (!favourites) {
            const product = await Product.findOne({productId:productId});
            if (product) {
                favourites = new this({ email, products: [productId] });
                message = "added product to favourites";
                await favourites.save();
            } else {
                throw new Error("Invalid Product Id");
            }
        } else {
            const productIndex = favourites.products.indexOf(productId);
            if (productIndex > -1) {
                favourites.products.splice(productIndex, 1);
                message = "product removed from favourites";
            } else {
                const product = await Product.findOne({productId:productId});
                if (product) {
                    favourites.products.push(Number(productId));
                    message = "added product to favourites";
                } else {
                    throw new Error("Invalid Product Id");
                }
            }
            await favourites.save();
        }
        return message;
    } catch (error) {
        throw error;
    }
};


favouritesSchema.statics.isFavourite = async function(email,productId){
    try{
        const favourites = await this.findOne({email});
        if(!favourites) return false;
        else{
            if(favourites.products.includes(productId)){
                return true;
            }
            return false;
        }
    }catch(error){
        return false;
    }
    return false;
}
// Remove a product from the favourites
favouritesSchema.statics.removeFromFavourites = async function(email, productId) {
    try {
        const favourites = await this.findOne({ email });

        if (!favourites) {
            return null;
        }

        favourites.products = await favourites.products.filter(p => p !== productId);

        await favourites.save();
        return favourites;
    } catch (error) {
        throw error;
    }
};

const Favourites = mongoose.model("Favourites",favouritesSchema);
export default Favourites;