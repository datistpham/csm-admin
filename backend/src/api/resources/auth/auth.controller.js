import { db } from '../../../models';
import JWT from 'jsonwebtoken';
import mailer from '../../../mailer';
import config from '../../../config';
import bcrypt from 'bcrypt-nodejs';
import speakeasy from 'speakeasy';
// import { validateEmail } from './../../../functions'
import md5 from "md5"
import nodemailer from "nodemailer"
import axios from "axios"

var JWTSign = function (user, date) {
    return JWT.sign({
        iss: config.app.name,
        sub: user.id,
        iam : user.type,
        iat: date.getTime(),
        exp: new Date().setMinutes(date.getMinutes() + 30)
    }, process.env.JWT_SECRET);
}

function generateOtp() {
    let token = speakeasy.totp({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        step: (30 - Math.floor((new Date().getTime() / 1000.0 % 30)))
    });
    return token;
}

function verifyOtp(token) {
    let expiry = speakeasy.totp.verify({
        secret: process.env.OTP_KEY,
        encoding: 'base32',
        token: token,
        step: (30 - Math.floor((new Date().getTime() / 1000.0 % 30))),
        window: 0
    });
    return expiry
}


export default {
    async addUser(req, res, next) {
        const { firstName, lastName, phoneNo, email, address, password, role, verify } = req.body;
        var passwordHash = md5(password);
        var token = generateOtp();
        var otp = verifyOtp(token);
        db.user.findOne({ where: { email: email }, paranoid: false })
            .then(find => {
                if (find) {
                    return res.status(409).json({message: "Email is already in use", ok: false});
                }
                return db.user.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNo: phoneNo,
                    address: address,
                    password: passwordHash,
                    verify: verify,
                    role: role
                })

            })
            .then(user => {
                if (user) {
                    mailer.sendEmployeePassword(email, token);
                    return res.status(200).json({ success: true, key: otp, msg: "New Registration added and password has been sent to " + email + " ." });
                }
                else
                    res.status(500).json({ 'success': false });
            })
            .catch(err => {
                console.log(err)
                next(err);
            })
    },

    async findUser(req,res,next){
        db.user.findOne({ attributes:["firstName","lastName", "email"], where: { id: req.query.user_id }})
        .then(user => {
            if (user) {
                return res.status(200).json({ success: true, data:user, ok: true});
            }
            else
                res.status(500).json({ 'success': false });
        })
        .catch(err => {
            console.log(err)
            next(err);
        })
    },

     async getAllUserList(req,res,next){
        db.user.findAll()
        .then(user => {
            if (user) {
                return res.status(200).json({ success: true, data:user});
            }
            else
                res.status(500).json({ 'success': false });
        })
        .catch(err => {
            console.log(err)
            next(err);
        })
    },

     async userUpdate(req,res,next){
        const { id, firstName, lastName, email, address, password, role, verify } = req.body;
        var passwordHash = bcrypt.hashSync(password);
        db.user.findOne({ where: { email: email }, paranoid: false })
            .then(user => {
                if (!user) {
                    throw new RequestError('User is not found', 409);
                }
                return db.user.update({
                    firstName: firstName ? firstName: user.firstName,
                    lastName: lastName ? lastName: user.lastName,
                    password: password ? passwordHash: user.passwordHash,
                    address: address ? address : user.address,
                    role: role ? role: user.role,
                    verify : verify? verify: user.verify
                }, { where: { id: id } })

            })
            .then(user => {
                if (user) {
                    return res.status(200).json({ success: true, msg: "User update successsfully"});
                }
                else
                    res.status(500).json({ 'success': false });
            })
            .catch(err => {
                console.log(err)
                next(err);
            })
    },

    // async login(req, res, next) {
    //     var date = new Date();
    //     var token = JWTSign(req.user, date);
    //     res.cookie('XSRF-token',token, {
    //         expire: new Date().setMinutes(date.getMinutes() + 30),
    //         httpOnly: true, secure: config.app.secure
    //     });
        
    //     return res.status(200).json({ success: true ,token, role: req.user.role});
    // },
    async login(req, res, next) {
        const {email, password }= req.body
        // var date = new Date();
        // console.log(password)
        // console.log(bcrypt.hashSync(password))
        const findUser= await db.user.findOne({where: {email, password: md5(password)}})
        if(findUser) {
            const token= JWT.sign({uid: findUser.dataValues.id, id: findUser.dataValues.id}, process.env.JWT_SECRET)
            return res.status(200).json({ success: true, token, auid: findUser.dataValues.id, role: findUser.dataValues.role });
        }
        else {
            return res.status(200).json({ success: false });
        }
    },

     async deleteUserList(req, res, next) {
        db.user.findOne({ where: { id: req.body.id} })
            .then(data => {
                if (data) {
                    return db.user.destroy({ where: { id: req.body.id } }).then(r => [r, data])
                }
                throw new RequestError('User is not found', 409)
            })
            .then(re => {
                return res.status(200).json({ 'status': "deleted userlist Seccessfully" });
            }).catch(err => {
                next(err)
            })
    },
    async verifyMail(req, res) {
        try {
            // Nhận email từ request body
            const { email, password, firstName } = req.body;
    
            // Tạo một mã xác thực ngẫu nhiên
           
    
            // Cấu hình thông tin mail server (dùng Gmail làm ví dụ)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USERNAME, // Thay bằng địa chỉ email của bạn
                    pass: process.env.MAIL_PASSWORD // Thay bằng mật khẩu email của bạn
                }
            });
    
            // Cấu hình nội dung email
            const mailOptions = {
                from: process.env.MAIL_USERNAME, // Thay bằng địa chỉ email của bạn
                to: email, // Địa chỉ email người dùng cần xác thực
                subject: 'Email Verification', // Tiêu đề email
                html: `
                    <a href="${process.env.URL_FRONTEND}/signup/success" style="padding: 10px; border-radius: 10px; background-color: #2e89ff; color: #fff; width: 100%">Click here to complete singup process</a>
                ` // Nội dung email chứa mã xác thực
            };
            
            // Gửi email
            await transporter.sendMail(mailOptions);
            // Trả về mã xác thực để sử dụng sau này (ví dụ để kiểm tra mã khi người dùng nhập vào)
            res.json({ success: true });
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error sending verification email:', error);
            res.status(500).json({ success: false, error: 'Error sending verification email' });
        }
    }
}




