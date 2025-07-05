const jwt = require("jsonwebtoken");
const { UnauthorizedError, ValidationError } = require("../../model/error/custom.error");
const UserService = require("../../services/user/user.service");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  extractMobileFromToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token is missing or invalid.");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.mobile) {
      throw new UnauthorizedError("Mobile number is missing in token.");
    }
    return decoded.mobile;
  }

  profile = async (req, res) => {
    const mobile = this.extractMobileFromToken(req);
    const result = await this.userService.getProfile(mobile);
    return res.status(200).json({ 
      status: 200, 
      message: "OK", 
      data: result 
    });
  };

  editProfile = async (req, res) => {
    const { name, email, image } = req.body;
    if (!name && !email && !image) {
      throw new ValidationError("At least one field (name, email, or image) is required to update.");
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (image) updateData.image = image;

    const mobile = this.extractMobileFromToken(req);
    const result = await this.userService.updateProfile(mobile, updateData);
    return res.status(200).json({ 
      status: 200, 
      message: "OK", 
      data: "Profile updated successfully." 
    });
  };

updateFcmToken = async (req, res) => {
  const mobile = this.extractMobileFromToken(req);
  const { fcm_token } = req.body;
  if (!fcm_token) {
    throw new ValidationError("FCM token is required.");
  }
  await this.userService.updateFcmTokenByMobile(mobile, fcm_token);
  res.status(200).json({ status: 200, message: "OK", data: "FCM token updated successfully." });
};

}

module.exports = new UserController();
