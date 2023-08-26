import 'dotenv/config';
import { db } from './models';
import { restRouter } from './api';
import config from './config';
import appManager from './app';
// import kue from './kue';
import './errors';
import scheduler from './scheduler';
import path from 'path';
import cors from 'cors';
import checkExpiredVouchers from './cronjob';
global.appRoot = path.resolve(__dirname);

const PORT = config.app.port;
const app = appManager.setup(config);

/*cors handling*/
app.use(cors({
	origin: ["https://csm-admin.vercel.app", "https://csm-eight.vercel.app/"],
	credentials: true
}));
// app.options('*', cors());

/* Route handling */
app.use('/api', restRouter);
// app.use('/', webRouter);



// kue.init();
/* Database Connection */
db.sequelize.authenticate().then(function () {
	console.log('Nice! Database looks fine');
	scheduler.init();
}).catch(function (err) {
	console.log(err, "Something went wrong with the Database Update!")
});

checkExpiredVouchers.start()

/* Start Listening service */
app.listen(PORT, () => {
	console.log(`Server is running at PORT http://localhost:${PORT}`);
});