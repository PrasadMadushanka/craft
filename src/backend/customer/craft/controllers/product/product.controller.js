const Joi = require("joi");
const { ValidationError } = require("../../model/error/custom.error.js");
const ProductService = require("../../services/product/product.service.js");
const productSearchSchema = Joi.object({ name: Joi.string().required() });

const productService = new ProductService();

class ProductController {
  async findAll(req, res) {
    const { shopId } = req.query;
    if (!shopId) {
      return res.status(200).json({
        status: 406,
        message: "Not acceptable",
        error: "Shop id is required",
      });
    }
    const products = await productService.findAll(parseInt(shopId));
    return res.status(200).json({
      status: 200,
      message: "OK",
      data: products,
    });
  }

  async productSearch(req, res) {
    const { value, error } = productSearchSchema.validate(req.query);
    if (error) {
      throw new ValidationError(error.message);
    }
    const products = await productService.productSearch(value.name);
    return res.status(200).json({
      status: 200,
      message: "OK",
      data: products,
    });
  }

  async findOne(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        status: 406,
        message: "Not acceptable",
        error: "Products id is required",
      });
    }
    const product = await productService.findOne(parseInt(id));
    return res.status(200).json({
      status: 200,
      message: "OK",
      data: product,
    });
  }
}


module.exports = new ProductController();
