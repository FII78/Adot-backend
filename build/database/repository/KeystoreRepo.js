"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keystore_1 = require("../model/Keystore");
async function findforKey(client, key) {
    return Keystore_1.KeystoreModel.findOne({
        client: client,
        primaryKey: key,
        status: true,
    })
        .lean()
        .exec();
}
async function remove(id) {
    return Keystore_1.KeystoreModel.findByIdAndRemove(id).lean().exec();
}
async function removeAllForClient(client) {
    return Keystore_1.KeystoreModel.deleteMany({ client: client }).exec();
}
async function find(client, primaryKey, secondaryKey) {
    return Keystore_1.KeystoreModel.findOne({
        client: client,
        primaryKey: primaryKey,
        secondaryKey: secondaryKey,
    })
        .lean()
        .exec();
}
async function create(client, primaryKey, secondaryKey) {
    const now = new Date();
    const keystore = await Keystore_1.KeystoreModel.create({
        client: client,
        primaryKey: primaryKey,
        secondaryKey: secondaryKey,
        createdAt: now,
        updatedAt: now,
    });
    return keystore.toObject();
}
exports.default = {
    findforKey,
    remove,
    removeAllForClient,
    find,
    create,
};
//# sourceMappingURL=KeystoreRepo.js.map