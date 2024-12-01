import Category from "../models/Category.js";

class CategoryController {
    createCategory(request, response) {
        Category.createCategory(request.body, response);
    }   
    getAllCategorise(request, response) {
        Category.getAllCategories(response);
    }
    getCategoryById(request, response) {
        Category.getCategoryById(request.params.categoryId, response);
    }
    getPostsByCategory(request, response) {
        Category.getPostByCategory(request.params.categoryId, response);
    }
    changeCategory(request, response) {
        Category.changeCategory(request.params.categoryId, request.body, response);
    }
    deleteCategory(request, response) {
        Category.deleteCategory(request.params.categoryId, response);
    }
}

export default new CategoryController();