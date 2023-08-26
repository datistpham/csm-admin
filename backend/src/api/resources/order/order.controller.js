import mailer from '../../../mailer';
import { db } from '../../../models';
var Sequelize = require("sequelize");
export default {

    async index(req, res) {
        try {
            const { customerId, paymentmethod, orderId, deliveryAddress, product, grandTotal, voucherId, deliveryCharge, reason } = req.body;
            console.log(voucherId)
            db.customer.findOne({ where: { id: customerId } })
                .then(p => {
                    if (p) {
                        return db.Order.create({
                            custId: customerId,
                            number: orderId,
                            grandtotal: grandTotal,
                            paymentmethod: paymentmethod,
                            voucherId: voucherId || 0, 
                            deliveryFee: deliveryCharge,
                            reason: reason || ""
                        })
                    }
                    return res.status(500).json({ 'errors': ['User is not found'] });
                })
                .then((order) => {
                    if (order) {
                        return db.Address.create({
                            orderId: order.id,
                            custId: customerId,
                            fullname: deliveryAddress?deliveryAddress.name:'',
                            phone: deliveryAddress?deliveryAddress.phone:'',
                            discrict: deliveryAddress?deliveryAddress.discrict:'',
                            city: deliveryAddress?deliveryAddress.city:'',
                            states: deliveryAddress?deliveryAddress.states:'',
                            shipping: deliveryAddress?deliveryAddress.address:'',
                        }).then((p) => [order, p])
                    }
                })
                .then(([order, p]) => {
                    if (order) {
                        let cartEntries = [];
                        for (var i = 0; i < product.length; i++) {
                            cartEntries.push({
                                orderId: order.id,
                                addressId: p.id,
                                productId: product[i].id,
                                name: product[i].name,
                                qty: product[i].qty,
                                price: product[i].price,
                                total: product[i].total,
                                photo: product[i].photo,
                                discount: product[i].discountPer
                            })
                        }
                        return db.Cart.bulkCreate(cartEntries).then((r) => [r])
                    }
                })
                .then((success) => {
                    mailer.sendUserOrder(deliveryAddress?.email ||"", "You have ordered successfully, ordered at "+ new Date())
                    res.status(200).json({ 'success': true });
                })
                .catch(function (err) {
                    mailer.sendUserOrder(deliveryAddress?.email ||"", "You have ordered failed, ordered at "+ new Date())
                    console.log(err);   
                    res.status(500).json({ 'errors': ['Error adding cart'] });
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

    async getAllOrderList(req, res, next) {
        let limit = 10;
        let sort = ['createdAt', 'DESC'];
        let offset = 0;
        let page = 1;
        if(req.query.limit != undefined){
            limit = parseInt(req.query.limit);
        }
        if(req.query.page != undefined){
            page = req.query.page;
            if(page < 1)
                page = 1;
        }
        if(req.query.sort){
            if(req.query.sort == 'name'){
                sort = ['name'];
            }
        }
        try {
            
            db.Order.findAll({
                order: [['createdAt', 'DESC']],
                include: [{ model: db.Address }, { model: db.Cart }],
            })
                .then(list => {
                    res.status(200).json({ 'success': true, order: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },

    async statusUpdate(req, res, next) {
        try {
            const { id, status, deliverydate } = req.body;
            db.Order.findOne({ where: { id: id } })
                .then(list => {
                    if(req.body?.status=== "delieverd") {
                        mailer.sendUserOrder(req.body?.email ||"", `Your #ORDER-${list.number} have delivered successfully, delivered at `+ req.body?.deliverydate)
                    }
                    if(req.body?.status=== "processing") {
                        mailer.sendUserOrder(req.body?.email ||"", `Your #ORDER-${list.number} is processing, delivered at `+ req.body?.deliverydate)
                    }
                    if(req.body?.status=== "shipping") {
                        mailer.sendUserOrder(req.body?.email ||"", `Your #ORDER-${list.number} is shipping, shipping at `+ req.body?.deliverydate)
                    }
                    if(req.body?.status=== "cancel") {
                        mailer.sendUserOrder(req.body?.email ||"", `Your #ORDER-${list.number} is canceled, reason: ${req.body?.reason || ""}, cancel at `+ req.body?.deliverydate)
                    }
                    return db.Order.update({
                        status: status,
                        deliverydate: deliverydate ? deliverydate : list.deliverydate,
                        reason: req.body.reason || ""
                    }, { where: { id: id } })
                    
                })
                .then((success) => {
                    
                    res.status(200).json({ 'success': true, msg: "Successfully Updated Status" });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },

    async getAllOrderListById(req, res, next) {
        try {
            db.Order.findAll({
                where: { custId: req.body.id },
                order: [['createdAt', 'DESC']],
                include: [{ model: db.Address, include: [{ model: db.Cart, include: [{model: db.product}] }] }],
            })
                .then(list => {
                    res.status(200).json({ 'success': true, order: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },
    async getAllOrderStatus(req, res, next) {
        try {
            db.Order.findAll({
                where: { status: req.body.status },
                order: [['createdAt', 'DESC']],
                include: [{ model: db.Address, include: [{ model: db.Cart }] }],
            })
                .then(list => {
                    res.status(200).json({ 'success': true, order: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },
    async getAllOrderCount(req, res, next) {
        try {
            db.Order.findAll({
                attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'total']],
                group: ['status']
            })
                .then(list => {
                    res.status(200).json({ 'success': true, data: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },
}


