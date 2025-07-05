const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const { ValidationError } = require("../../model/error/custom.error");

class ShopService {
 async findAll() {
  const shops = await prisma.shop.findMany({
    where: { deleted: 0 },
    select: {
      id: true,
      email: true,
      mobile: true,
      address: true,
      description: true,
      opening_time: true,
      closing_time: true,
      shop_logo: true,
      banner: true,
      latitude: true,
      longitude: true,
      name: true,
      recommended: true,
      active: true,
      shop_feedback: {
        select: {
          id: true,
          customer_id: true,
          order_id: true,
          rating: true,
          comment: true,
          created_at: true,
        }
      },
      shop_category: {
        select: {
          id: true,
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
            }
          }
        }
      }
    }
  });
  return shops.map(shop => {
    const feedbacks = shop.shop_feedback || [];
    const avgRating = feedbacks.length
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2)
      : null;
    return {
      ...shop,
      average_rating: avgRating,
      feedback_count: feedbacks.length,
      shop_feedback: feedbacks,
      shop_category: shop.shop_category,
    };
  });
}

  async search(filters = {}) {
     const shops = await prisma.shop.findMany({
      where: {
        deleted: 0,
        OR: [
          { name: { contains: filters.text } },
          { address: { contains: filters.text } },
          { description: { contains: filters.text } },
          { mobile: { contains: filters.text } },
          { email: { contains: filters.text } },
        ],
        ...(filters.category_id && {
          shop_category: {
            some: {
              category_id: parseInt(filters.category_id),
            }
          }
        }),
      },
        select: {
      id: true,
      email: true,
      mobile: true,
      address: true,
      description: true,
      opening_time: true,
      closing_time: true,
      shop_logo: true,
      banner: true,
      latitude: true,
      longitude: true,
      name: true,
      recommended: true,
      active: true,
      shop_feedback: {
        select: {
          id: true,
          customer_id: true,
          order_id: true,
          rating: true,
          comment: true,
          created_at: true,
        }
      },
      shop_category: {
        select: {
          id: true,
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
            }
          }
        }
      }
    }
  });

  return shops.map(shop => {
    const feedbacks = shop.shop_feedback || [];
    const avgRating = feedbacks.length
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2)
      : null;
    return {
      ...shop,
      average_rating: avgRating,
      feedback_count: feedbacks.length,
      shop_feedback: feedbacks,
      shop_category: shop.shop_category,
    };
  });
}

  async findAllCategory(filters = {}) {
    const { id, name, image } = filters;
    return await prisma.category.findMany({
      where: {
        ...(id && { id: parseInt(id) }),
        ...(name && { shop_name: { contains: name } }),
        ...(image && { image: { contains: image } }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      }
    });
  }

async findAllOffers() {
  return await prisma.shop.findMany({
    where: {
      deleted: 0,
      product: {
        some: {
          product_promotion: {
            some: {
              active: 1,
              promotion: {
                active: 1
              }
            }
          }
        }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      address: true,
      description: true,
      opening_time: true,
      closing_time: true,
      shop_logo: true,
      banner: true,
      latitude: true,
      longitude: true,
      recommended: true,
      active: true,
      product: {
        select: {
          id: true,
          name: true,
          product_promotion: {
            where: { active: 1, promotion: { active: 1 } },
            select: {
              id: true,
              promotion: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  code: true,
                  image: true,
                  type: true,
                  value: true,
                  min_order_amount: true,
                  max_discount_amount: true,
                  start_date: true,
                  end_date: true,
                  active: true
                }
              }
            }
          }
        }
      }
    }
  });
}

  async findAllRecommended() {
    const shops = await prisma.shop.findMany({
      where: { recommended: 1, deleted: 0 },
    select: {
      id: true,
      email: true,
      mobile: true,
      address: true,
      description: true,
      opening_time: true,
      closing_time: true,
      shop_logo: true,
      banner: true,
      latitude: true,
      longitude: true,
      name: true,
      recommended: true,
      active: true,
      shop_feedback: {
        select: {
          id: true,
          customer_id: true,
          order_id: true,
          rating: true,
          comment: true,
          created_at: true,
        }
      },
      shop_category: {
        select: {
          id: true,
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
            }
          }
        }
      }
    }
  });
  return shops.map(shop => {
    const feedbacks = shop.shop_feedback || [];
    const avgRating = feedbacks.length
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2)
      : null;
    return {
      ...shop,
      average_rating: avgRating,
      feedback_count: feedbacks.length,
      shop_feedback: feedbacks,
      shop_category: shop.shop_category,
    };
  });
}

  async findOne(shopId) {
  const shop = await prisma.shop.findUnique({
    where: { id: parseInt(shopId) },
    select: {
      id: true,
      email: true,
      mobile: true,
      address: true,
      description: true,
      opening_time: true,
      closing_time: true,
      shop_logo: true,
      banner: true,
      latitude: true,
      longitude: true,
      name: true,
      recommended: true,
      active: true,
      shop_feedback: {
        select: {
          id: true,
          customer_id: true,
          order_id: true,
          rating: true,
          comment: true,
          created_at: true,
        }
      },
      shop_category: {
        select: {
          id: true,
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
            }
          }
        }
      }
    }
  });
  if (!shop) return null;

  const feedbacks = shop.shop_feedback || [];
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2)
    : null;

  return {
    ...shop,
    average_rating: avgRating,
    feedback_count: feedbacks.length,
    shop_feedback: feedbacks,
    shop_category: shop.shop_category,
  };
}
async calculateDeliveryFee(shopId, latitude, longitude) {
    const shop = await this.findOne(shopId);
    const deliveryFeeConfig = await prisma.delivery_fee.findFirst();
    const baseFee = deliveryFeeConfig.base_fee;
    const perKm = deliveryFeeConfig.per_km;
    const fixedTime = deliveryFeeConfig.fixed_time || 0;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const origins = `${shop.latitude},${shop.longitude}`;
    const destinations = `${latitude},${longitude}`;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

    const response = await axios.get(url);
    const element = response?.data?.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK" || !element.distance || !element.duration) {
      const googleStatus = element?.status || "UNKNOWN";
      return { error: true, message: `Unable to calculate distance/time: ${googleStatus}` };
    }

    const distanceKm = element.distance.value / 1000;
    const estimateTimeMin = Math.round(element.duration.value / 60) + fixedTime;
    const fee = parseFloat((baseFee + distanceKm * perKm).toFixed(2)); 

    return {
      deliveryFee: fee,
      distance: distanceKm,
      estimateTime: estimateTimeMin
    };
}}


module.exports = ShopService;
