"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../model/User");
const KeystoreRepo_1 = __importDefault(require("./KeystoreRepo"));
async function exists(id) {
    const user = await User_1.UserModel.exists({ _id: id, status: true });
    return user !== null && user !== undefined;
}
async function findPrivateProfileById(id) {
    return User_1.UserModel.findOne({ _id: id, status: true })
        .select('+phone')
        .lean()
        .exec();
}
async function findById(id) {
    return User_1.UserModel.findOne({ _id: id, status: true })
        .select('+phone +password +role')
        .lean()
        .exec();
}
async function findByEmail(email) {
    return User_1.UserModel.findOne({ email: email })
        .select('+email +password +role')
        .lean()
        .exec();
}
async function findByPhone(phone) {
    return User_1.UserModel.findOne({ phone: phone })
        .select('+email +password +role')
        .lean()
        .exec();
}
async function findAll() {
    return findDetailedUsers({ status: true });
}
async function findDetailedUsers(query) {
    return User_1.UserModel.find(query)
        .lean()
        .exec();
}
async function create(user, accessTokenKey, refreshTokenKey) {
    const now = new Date();
    user.createdAt = user.updatedAt = now;
    const createdUser = await User_1.UserModel.create(user);
    const keystore = await KeystoreRepo_1.default.create(createdUser, accessTokenKey, refreshTokenKey);
    return {
        user: { ...createdUser.toObject(), role: user.role },
        keystore: keystore,
    };
}
async function update(user, accessTokenKey, refreshTokenKey) {
    user.updatedAt = new Date();
    await User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
        .lean()
        .exec();
    const keystore = await KeystoreRepo_1.default.create(user, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
}
async function updateInfo(user) {
    user.updatedAt = new Date();
    return User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
        .lean()
        .exec();
}
exports.default = {
    exists,
    findPrivateProfileById,
    findById,
    findByEmail,
    findByPhone,
    create,
    update,
    updateInfo,
    findAll
};
//# sourceMappingURL=UserRepo.js.map