const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const OrderService = require("../../services/order/order.service");
const ShopService = require("../../services/inventory/shop.service");
const ProductService = require("../../services/product/product.service");
const { ValidationError } = require("../../model/error/custom.error");

const orderSchema = Joi.object({
  customer_id: Joi.number().integer().required(),
  shop_id: Joi.number().integer().required(),
  promotion_id: Joi.number().integer().optional(),
  delivery_code: Joi.string().optional(),
  product: Joi.array().items(
    Joi.object({
      id: Joi.number().integer().required(),          // product id
      quantity: Joi.number().integer().min(1).required(),
      variantId: Joi.number().integer().optional()
    })
  ).required(),
  tip_amount: Joi.number().min(0).optional(),
  status: Joi.string().valid("PLACED", "SHOP_ACCEPT", "PROCESS_DONE", "DRIVER_PICKUP", "DELIVERED", "RETURN").required(),
  type: Joi.string().valid("COD", "CARD").required(),
  address: Joi.string().required(),
  driver_note: Joi.string().optional(),
  street_or_apartment_no: Joi.string().optional(),
  delivery_instruction: Joi.string().optional(),
  spatial_instruction: Joi.string().optional(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required()
});

class OrderController {
  constructor() {
    this.orderService = new OrderService();
    this.shopService = new ShopService();
    this.productService = new ProductService();

    this.save = asyncHandler(this.save.bind(this));
    this.findAll = asyncHandler(this.findAll.bind(this));
    this.search = asyncHandler(this.search.bind(this));
  }

  async save(req, res) {
    const { error, value } = orderSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(406).json({
        status: 406,
        message: "Validation error",
        error: error.details.map((e) => ({
          field: e.context.key,
          message: e.message
        }))
      });
    }

    const shop = await this.shopService.findOne(value.shop_id);
    if (!shop) throw new ValidationError("Shop not found");

    const customerId = req.user.id;
    const customer = await this.orderService.getCustomerById(customerId);
    if (!customer) throw new ValidationError("Customer not found");

    // Attach _item and _variant to each product
    for (const product of value.product) {
      const item = await this.productService.findOne(product.id);
      if (!item) throw new ValidationError("Product not found");

      product._item = item;

      if (product.variantId) {
        const variant = await this.productService.getVariantById(product.variantId);
        if (!variant) throw new ValidationError("Variant not found");

        product._variant = variant;
      }
    }

    const result = await this.orderService.save(value, customerId);

    return res.status(200).json({
      status: 200,
      message: "Order placed successfully",
      data: result
    });
  }

  async findAll(req, res) {
    const orders = await this.orderService.findAll({ customer_id: req.user.id });
    res.status(200).json({ status: 200, message: "OK", data: orders });
  }

  async search(req, res) {
    const orders = await this.orderService.search({ ...req.query, customer_id: req.user.id });
    res.status(200).json({ status: 200, message: "OK", data: orders });
  }
}

module.exports = new OrderController();
