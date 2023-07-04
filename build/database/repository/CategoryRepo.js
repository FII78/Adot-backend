"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = require("../model/Category");
async function findAll() {
    return findDetailedCatrgories({ status: true });
}
async function findDetailedCatrgories(query) {
    return Category_1.CategoryModel.find(query)
        .select('+title')
        .lean()
        .exec();
}
async function create(category) {
    const now = new Date();
    const createdCategory = await Category_1.CategoryModel.create(category);
    return {
        category: { ...createdCategory.toObject() }
    };
}
async function findCategoryAllDataById(id) {
    return Category_1.CategoryModel.findOne({ _id: id, status: true })
        .lean()
        .exec();
}
async function update(category) {
    return Category_1.CategoryModel.findByIdAndUpdate(category._id, category, { new: true })
        .lean()
        .exec();
}
async function Delete(categoryId) {
    const category = Category_1.CategoryModel.findOne({ _id: categoryId, status: true });
    await Category_1.CategoryModel.deleteOne(category)
        .lean()
        .exec();
}
async function findInfoById(id) {
    return Category_1.CategoryModel.findOne({ _id: id, status: true })
        .lean()
        .exec();
}
exports.default = {
    findAll,
    create,
    findCategoryAllDataById,
    update,
    Delete,
    findInfoById
};
//# sourceMappingURL=CategoryRepo.js.map