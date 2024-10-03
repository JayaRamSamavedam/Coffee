import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
      },
      brandstory:{
        type:String,
      },
      roasting_techniques:{
        type:String,
      },
      coffee_blends:{
        type:[String],
      },
      social_links:{
        instagram:{
          type:String,
        },
        twitter:{
          type:String,
        },
        youtube:{
          type:String,
        }
      },
      proImage:{
        type:String,
      },
      discount:{
        type:Number,
        default:0,
      },
      link:{
        type:String,
      },
      contact_email:{
        type:String,
      }
});

brandSchema.pre("save", async function (next) {
  
    this.link=`/${this.name}`;
    next();
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;