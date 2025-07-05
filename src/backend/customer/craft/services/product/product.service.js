const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//const { sendFcmNotification } = require("../../config/fcm/fcm.config");

class OrderService {
  async save(orderData, customer_id) {
    const deliveryFeeResult = await new (require("../inventory/shop.service"))().calculateDeliveryFee(
      orderData.shop_id,
      orderData.latitude,
      orderData.longitude
    );

    if (deliveryFeeResult.error) {
      throw new Error(deliveryFeeResult.error || "Failed to calculate delivery fee");
    }

    const deliveryFee = deliveryFeeResult.deliveryFee;
    let totalPrice = 0;
    let orderProducts = [];

    for (const food of orderData.food) {
      const foodItem = food._item;
      const foodCategory = food._category;
      const variant = food._variant || null; 

      let foodPrice = foodItem.price;
      if (variant) {
        foodPrice += variant.price;
      }

      totalPrice += foodPrice * food.quantity;

      orderProducts.push({
        product_id: food.id,
        food_variant_id: food.variantId || null,
        quantity: food.quantity,
        price: foodPrice,
        food_name: foodItem.name,
        food_category: foodCategory.name,
      });
    }

    const deliveryFeeConfig = await prisma.delivery_fee.findFirst();
    const baseFee = deliveryFeeConfig.base_fee;
    const income = totalPrice * (18 / 100) + baseFee;
    const shopIncome = totalPrice - income;
    totalPrice += deliveryFee;

    return prisma.$transaction(async (txs) => {
      const estimateTimeMin = deliveryFeeResult.estimateTime || 0;
      const deliveryTime = new Date(Date.now() + estimateTimeMin * 60 * 1000);

      const newOrder = await txs.order.create({
        data: {
          total_price: totalPrice,
          customer_id: parseInt(customer_id),
          shop_id: parseInt(orderData.shop_id),
          promotion_id: orderData.promotion_id || null,
          delivery_fee: deliveryFee,
          tip_amount: orderData.tip_amount || 0,
          status: "PLACED",
          type: orderData.type,
          address: orderData.address,
          driver_note: orderData.driver_note || null,
          street_or_apartment_no: orderData.street_or_apartment_no || null,
          delivery_instruction: orderData.delivery_instruction || null,
          spatial_instruction: orderData.spatial_instruction || null,
          latitude: orderData.latitude || 0,
          longitude: orderData.longitude || 0,
          delivery_time: deliveryTime,
        },
      });

      await Promise.all([
        txs.order_product.createMany({
          data: orderProducts.map((p) => ({
            order_id: newOrder.id,
            food_id: p.product_id,
            food_variant_id: p.food_variant_id,
            quantity: p.quantity,
            price: p.price,
            food_name: p.food_name,
            food_category: p.food_category,
          })),
        }),
        txs.income.create({
          data: { order_id: newOrder.id, amount: income },
        }),
        txs.shop_wallet.create({
          data: { shop_id: parseInt(orderData.shop_id), order_id: newOrder.id, amount: shopIncome },
        }),
      ]);

      const shop = await txs.shop.findUnique({
  where: { id: parseInt(orderData.shop_id) },
  select: { fcm_token: true }
});
//await sendFcmNotification(newOrder.id, shop?.fcm_token || null);

      return await txs.order.findUnique({
        where: { id: newOrder.id },
        select: {
          id: true,
          customer_id: true,
          shop_id: true,
          driver_id: true,
          promotion_id: true,
          total_price: true,
          delivery_fee: true,
          tip_amount: true,
          accept_status: true,
          status: true,
          type: true,
          address: true,
          driver_note: true,
          street_or_apartment_no: true,
          delivery_instruction: true,
          spatial_instruction: true,
          longitude: true,
          delivery_time: true,
          latitude: true,
        },
      });
    });
  }

  async getCustomerById(id) {
    return await prisma.customer.findUnique({ where: { id: parseInt(id) } });
  }

  async findAll(filter = {}) {
    return prisma.order.findMany({
      where: filter,
      include: {
        order_product: {
          include: {
            food: true,
            food_variant: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async search(query = {}) {
    if (!query.customer_id || !query.text) return [];

    return prisma.order.findMany({
      where: {
        customer_id: parseInt(query.customer_id),
        order_product: {
          some: {
            OR: [
              { food: { name: { contains: query.text } } },
              { food_variant: { name: { contains: query.text } } },
            ],
          },
        },
      },
      include: {
        order_product: {
          include: {
            food: true,
            food_variant: true,
          },
        },
      },
    });
  }

    async findOne(id) {
    return prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async getCategoryById(id) {
    return prisma.category.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async getVariantById(id) {
    return prisma.product_variant.findUnique({
      where: { id: parseInt(id) }
    });
  }

}

module.exports = OrderService;
