import express from 'express';
import orderController from './order.controller';
import { jwtStrategy } from '../../../middleware/strategy';
import { sanitize } from '../../../middleware/sanitizer';
// import { validateBody, schemas } from '../../../middleware/validator';

export const orderRouter = express.Router();
orderRouter.route('/create').post(orderController.index);
orderRouter.route('/list').get(orderController.getAllOrderList);
orderRouter.route('/status/update').post(orderController.statusUpdate);
orderRouter.route('/list').post(orderController.getAllOrderListById);
orderRouter.route('/status').post(orderController.getAllOrderStatus);
orderRouter.route('/count').get(orderController.getAllOrderCount);



















