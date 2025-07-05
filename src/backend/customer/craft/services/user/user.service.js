const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { UnauthorizedError } = require("../../model/error/custom.error");

class UserService {
  async getProfile(mobile) {
    const customer = await prisma.customer.findUnique({
      where: { mobile, deleted: 0 },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        image: true,
        active: true,
      },
    });
    return customer;
  }

  async updateProfile(mobile, updateData) {
    const updated = await prisma.customer.update({
      where: { mobile },
      data: updateData,
    });
    return updated;
  }

  async updateFcmTokenByMobile(mobile, fcm_token) {
  await prisma.customer.update({
    where: { mobile },
    data: { fcm_token }
  });
}
}

module.exports = UserService;
