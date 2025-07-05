const Joi = require("joi");
const ShopService = require("../../services/inventory/shop.service");
const shopSearchSchema = Joi.object({
  text: Joi.string().allow(null, "").optional(),
  category: Joi.string().allow(null, "").optional(),
});

const shopService = new ShopService();

class ShopController {
  async findAll(req, res) {
    const shops = await shopService.findAll(req.query);
    return res.status(200).json({ 
      status: 200, 
      message: "OK", 
      data: shops });
  }

  async search(req, res) {
    const { value } = shopSearchSchema.validate(req.query);
    const shops = await shopService.search(value);
    return res.status(200).json({ 
      status: 200, 
      message: "OK", 
      data: shops 
    });
  }

  async category(req, res) {
    const { id, name, image } = req.query;
    const category = await shopService.findAllCategory({ id, name, image });
    return res.status(200).json({ 
      status: 200, 
      message: "OK", 
      data: category 
    });
  }

  async specialOffers(req, res) {
    const offers = await shopService.findAllOffers(req.query);
    return res.status(200).json({ 
      status: 200, 
      message: "OK", 
      data: offers 
    });
  }

  async recommended(req, res) {
    const recommended = await shopService.findAllRecommended();
    return res.status(200).json({ 
      status: 200, 
      message: "OK", 
      data: recommended 
    });
  }

  async findOne(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(200).json({
        status: 406,
        message: "Not acceptable",
        error: "Shop id is required"
      });
    }
    const shop = await shopService.findOne(id);
    if (!shop) {
      return res.status(200).json({
        status: 406,
        message: "Not acceptable",
        error: "Invalid shop id"
      });
    }
    return res.status(200).json({ 
      status: 200, 
      message: "OK", 
      data: shop 
    });
  }
  async calculateDeliveryFee(req, res) {
    const { shopId, latitude, longitude } = req.body;
    if (!shopId || latitude === undefined || longitude === undefined) {
      return res.status(200).json({
        status: 406,
        message: "Not acceptable",
        error: "shopId, latitude, and longitude are required"
      });
    }
     const shop = await shopService.findOne(shopId);
    if (!shop) {
      return res.status(200).json({
        status: 406,
        message: "Not acceptable",
        error: "Shop not found"
      });
    }
    const result = await shopService.calculateDeliveryFee(shopId, latitude, longitude);
    if (result?.error) {
      return res.status(200).json({
        status: 406,
        message: "Not acceptable",
        error: result.message || "Invalid input data"
      });
    }
    return res.status(200).json({
      status: 200,
      message: "OK",
      data: result
    });
  }

}

module.exports = new ShopController();
