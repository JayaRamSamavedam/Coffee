import express from 'express';
import verifyAuthToken from '../middlewares/verifyAuthToken.js';
import * as controllers from '../controllers/userController.js';
import  checkRoleAccess from '../middlewares/checkroleaccess.js';
import * as controller from '../controllers/productController.js';
import * as admin from '../controllers/adminController.js';
import requestLogger from '../middlewares/requestlogger.js';

const router = express.Router();
// routes
// register 
router.post("/user/register",requestLogger,controllers.userRegister);
router.get("/user/validRefresh",requestLogger,controllers.hasValidRefreshToken);
//login
router.post("/user/login",requestLogger,controllers.userLogin);
//refreshtoken
router.post("/user/refresh",requestLogger,controllers.refreshToken);
//logout
router.post("/user/logout",requestLogger,verifyAuthToken,controllers.logout);
//password change
router.post("/user/changepassword",requestLogger,verifyAuthToken,controllers.changePassword);
//forgot password
router.post("/user/forgotpassword",requestLogger,controllers.forgotPassword);
// otpsend
router.post("/user/otp",requestLogger,controllers.userOtpSend);
//verifyotp
router.post("/user/verifyotp",requestLogger,controllers.verifyOtp);
//reset password
router.post("/user/resetpassword",requestLogger,controllers.resetPassword);
//change the phone number
router.post("/user/changephonenumber",requestLogger,verifyAuthToken,controllers.changePhoneNumber);
router.post("/user/changeusername",requestLogger,verifyAuthToken,controllers.changeUname);
router.post("/verify",requestLogger,controllers.verifyToken);
router.get("/user/getuser",verifyAuthToken,requestLogger,controllers.getUser);

router.post("/user/edituser",verifyAuthToken,requestLogger,controllers.editUserData);
router.post("/user/createdelivery",verifyAuthToken,requestLogger,controllers.addDeliveryData);
router.post("/user/editdeliveryAdress",verifyAuthToken,requestLogger,controllers.editDeliveryAddress);
router.post("/user/createbilling",verifyAuthToken,requestLogger,controllers.addBillingData);
router.post("/user/editbillingAdress",verifyAuthToken,requestLogger,controllers.editBillingdata);
router.post("/user/addpreference",verifyAuthToken,requestLogger,controllers.addPreference);
router.post("/user/editpreference",verifyAuthToken,requestLogger,controllers.editPreference);
export default router;