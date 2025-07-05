const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//const { sendFcmNotification } = require("../../config/fcm/fcm.config");
const ShopService = require("../inventory/shop.service");

class OrderService {
  async save(orderData, customer_id) {
  const shopService = new ShopService();
  const deliveryFeeResult = await shopService.calculateDeliveryFee(
    orderData.shop_id,
    orderData.latitude,
    orderData.longitude
  );

  if (deliveryFeeResult.error) {
    throw new Error(deliveryFeeResult.message || "Unable to calculate delivery fee");
  }

  const deliveryFee = deliveryFeeResult.deliveryFee;
  let totalPrice = 0;
  let orderProducts = [];

  for (const item of orderData.product) {
    const product = await prisma.product.findUnique({
      where: { id: item.id },
      include: { product_variant: true }
    });

    const variant = item.variantId
      ? await prisma.product_variant.findUnique({ where: { id: item.variantId } })
      : null;

    const productPrice = variant ? variant.price : 0;
    const lineTotal = productPrice * item.quantity;
    totalPrice += lineTotal;

    orderProducts.push({
      product_id: item.variantId || item.id,
      quantity: item.quantity,
      price: productPrice
    });
  }

  const deliveryFeeConfig = await prisma.delivery_fee.findFirst();
  const baseFee = deliveryFeeConfig?.base_fee || 0;
  const platformIncome = (totalPrice * 0.18) + baseFee;
  const shopIncome = totalPrice - platformIncome;
  totalPrice += deliveryFee;

  return await prisma.$transaction(async (txs) => {
    const deliveryTime = new Date(Date.now() + (deliveryFeeResult.estimateTime || 0) * 60000);

    const order = await txs.order.create({
      data: {
        total_price: totalPrice,
        customer_id: parseInt(customer_id),
        shop_id: orderData.shop_id,
        promotion_id: orderData.promotion_id || null,
        delivery_fee: deliveryFee,
        tip_amount: orderData.tip_amount || 0,
        status: "PLACED",
        payment_method: orderData.type,
        address: orderData.address,
        driver_note: orderData.driver_note || null,
        street_or_apartment_no: orderData.street_or_apartment_no || null,
        delivery_instruction: orderData.delivery_instruction || null,
        spatial_instruction: orderData.spatial_instruction || null,
        latitude: orderData.latitude,
        longitude: orderData.longitude,
        delivery_time: deliveryTime.toISOString()
      }
    });

    await txs.order_product.createMany({
      data: orderProducts.map(p => ({
        order_id: order.id,
        product_id: p.product_id,
        quantity: p.quantity,
        price: p.price
      }))
    });

    await txs.income.create({ data: { order_id: order.id, amount: platformIncome } });
    await txs.shop_wallet.create({ data: { shop_id: order.shop_id, order_id: order.id, amount: shopIncome } });

    const shop = await txs.shop.findUnique({ where: { id: order.shop_id }, select: { fcm_token: true } });
    //await sendFcmNotification(order.id, shop?.fcm_token || null);

    return order;
  });
}


  async getCustomerById(id) {
    return await prisma.customer.findUnique({ where: { id: parseInt(id) } });
  }

  async findAll(filter) {
    return await prisma.order.findMany({
      where: filter,
      include: {
        order_product: {
          include: {
            product_variant: true,
            product: true
          }
        }
      },
      orderBy: { created_at: "desc" }
    });
  }

  async search(query) {
    if (!query.customer_id || !query.text) return [];

    return await prisma.order.findMany({
      where: {
        customer_id: parseInt(query.customer_id),
        order_product: {
          some: {
            OR: [
              { product: { name: { contains: query.text, mode: "insensitive" } } },
              { product_variant: { name: { contains: query.text, mode: "insensitive" } } }
            ]
          }
        }
      },
      include: {
        order_product: {
          include: {
            product_variant: true,
            product: true
          }
        }
      }
    });
  }
}

module.exports = OrderService;
