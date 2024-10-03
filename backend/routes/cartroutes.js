import express from 'express';
import verifyAuthToken from '../middlewares/verifyAuthToken.js';
import  checkRoleAccess from '../middlewares/checkroleaccess.js';
import * as controller from "../controllers/cartController.js";
import requestLogger from '../middlewares/requestlogger.js';
const router = express.Router();


router.get("/cart/getproducts",verifyAuthToken,requestLogger,checkRoleAccess,controller.getCartDetails);
router.post("/cart/clear",verifyAuthToken,requestLogger,checkRoleAccess,controller.clearTheCart);
router.delete("/cart/remove/:productId",verifyAuthToken,requestLogger,checkRoleAccess,controller.removeFromCart);
router.put("/cart/decrement/:productId",verifyAuthToken,requestLogger,checkRoleAccess,controller.decrement);
router.put("/cart/increment/:productId",verifyAuthToken,requestLogger,checkRoleAccess,controller.increment);
router.post("/cart/add/:productId",verifyAuthToken,requestLogger,checkRoleAccess,controller.addToCart);


export default router;

