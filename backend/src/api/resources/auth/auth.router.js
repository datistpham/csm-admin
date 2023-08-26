import express from 'express';
import authController from './auth.controller';
// import { localStrategy , jwtStrategy} from '../../../middleware/strategy';
// import { sanitize } from '../../../middleware/sanitizer';
// import { validateBody, schemas } from '../../../middleware/validator';

export const authRouter = express.Router();

authRouter.route('/register').post(/*sanitize(),/* validateBody(schemas.registerSchema), */ authController.addUser);
authRouter.route('/user/getAllUserList').get(authController.getAllUserList);
authRouter.route('/user/update').post(authController.userUpdate);
authRouter.route('/user/delete').post(authController.deleteUserList);
authRouter.route('/info').get(authController.findUser);
authRouter.route('/rootLogin').post(authController.login);
authRouter.route('/verification').post(authController.verifyMail)


