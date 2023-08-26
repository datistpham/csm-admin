import express from 'express';
// import multer from 'multer';
// import path from 'path';
import vendorController from './vendor.controller';


export const vendorRouter = express.Router();
// vendorRouter.route('/create').post(validateBody(schemas.vendorDetails),vendorController.index);
vendorRouter.route('/create').post( vendorController.index); // tao
vendorRouter.route('/list').get( vendorController.getAllvendor); // get danh sdacsh
vendorRouter.route('/product-list').get(vendorController.getAllVendorProduct);
vendorRouter.route('/product/getAllProductById').post(vendorController.getProductByVendor);
vendorRouter.route('/update').post(vendorController.vendorUpdate); // sua
vendorRouter.route('/delete').delete(vendorController.vendorDelete); // xoa
vendorRouter.route('/product-delete').post(vendorController.vendorProductDelete);
vendorRouter.route('/product-add').post(vendorController.vendorAddProduct);







