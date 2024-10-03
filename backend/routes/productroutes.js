import express from 'express';
import verifyAuthToken from '../middlewares/verifyAuthToken.js';
import  checkRoleAccess from '../middlewares/checkroleaccess.js';
import * as controller from '../controllers/productController.js';
import currencyHandler from '../middlewares/currencyHandler.js';
import requestLogger from '../middlewares/requestlogger.js';
const router = express.Router();

router.put("/admin/prod/edit/:id",verifyAuthToken,requestLogger,checkRoleAccess,controller.editProduct);
router.post ("/admin/prod/create",verifyAuthToken,requestLogger,checkRoleAccess,controller.createProduct);
router.get("/prod/get",requestLogger,controller.getAllProducts);
router.get("/prod/getByID/:id",requestLogger,controller.getProductById);
router.get("/prod",requestLogger,controller.fetchProducts);
router.post("/user/create-review",verifyAuthToken,requestLogger,checkRoleAccess,controller.createReview);
router.post("/user/delete-review",verifyAuthToken,requestLogger,checkRoleAccess,controller.deleteReview);
router.post("/prod/delete-comment",verifyAuthToken,requestLogger,checkRoleAccess,controller.deleteComment);
router.get("/prod/getReviewByUser",verifyAuthToken,requestLogger,checkRoleAccess,controller.getReviewByUser);
router.get("/prod/getByProduct/:productId",requestLogger,controller.getReviewsByProduct);
router.post("/prod/editComment",verifyAuthToken,requestLogger,checkRoleAccess,controller.editComment);
router.delete("/admin/prod/delete/:id",verifyAuthToken,requestLogger,checkRoleAccess,controller.deleteProductByID);
router.post("/user/editreview",verifyAuthToken,requestLogger,checkRoleAccess,controller.editReview);
// edit brand

router.put("/admin/prod/editbrand",verifyAuthToken,requestLogger,checkRoleAccess,controller.editBrand);
// getproductsby brand
router.get("/prod/getproductsbybrand/:brandname",requestLogger,controller.getProductsByBrand);
// getall brands
router.get("/prod/getallbrands",requestLogger,controller.getAllBrands);
// resetprioritybybrand
// deletebrand
router.delete("/admin/prod/deletebrand",verifyAuthToken,requestLogger,checkRoleAccess,controller.deleteBrand);
// create brand
router.post("/admin/prod/createbrand",verifyAuthToken,requestLogger,checkRoleAccess,controller.createBrand);
router.get("/prod/getBrand/:name",verifyAuthToken,requestLogger,checkRoleAccess,controller.getBrandByName);
router.post("/prod/addAndRemoveFav/:productId",verifyAuthToken,requestLogger,checkRoleAccess,controller.AddAndRemoveFavourites);
router.get("/prod/getFavourites",verifyAuthToken,requestLogger,checkRoleAccess,controller.FavouriteProducts);
router.post("/prod/addfav",verifyAuthToken,requestLogger,controller.addToFav);
router.post("/prod/remfav",verifyAuthToken,requestLogger,controller.remToFav);
router.get("/prod/search",requestLogger,controller.search);
router.get("/prod/filter",requestLogger,controller.filters);

router.get('/prod/recommendations',verifyAuthToken,requestLogger,checkRoleAccess,controller.generateRecommendedProducts);
router.get('/prod/gettopproducts',requestLogger,controller.getTopProducts);
export default router;