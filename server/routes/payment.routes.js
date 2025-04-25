import {Router} from "express"
import { checkout ,getKey,paymentVerification} from "../controllers/coursePurchase.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";


const paymentRouter=new Router();

paymentRouter.route('/:courseId/purchase').get(isAuthenticated,checkout)
paymentRouter.route('/payment-verify').post(isAuthenticated,paymentVerification)
paymentRouter.route('/getkey').get(isAuthenticated,getKey)

export {paymentRouter};