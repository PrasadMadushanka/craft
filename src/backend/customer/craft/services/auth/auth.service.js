const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const OTPService = require("./otp.service");
const jwt = require("jsonwebtoken");
const {UnauthorizedError, ValidationError} = require("../../model/error/custom.error");

module.exports.signup = async (email, name, mobile) => {
    const existingUser = await prisma.customer.findFirst({
        where: {
            OR: [{email: email}, {mobile: mobile}],
        },
    });
    if (existingUser) {
        if (existingUser.email === email) {
            throw new ValidationError("A user with this email address already exists.");
        } else if (existingUser.mobile === mobile) {
            throw new ValidationError("A user with this mobile number already exists.");
        }
    }
    await prisma.customer.create({
        data: {
            name,
            email,
            mobile,
        },
    });
};

module.exports.signIn = async (mobile, otp) => {
    const isValid = await OTPService.verifyOTP(mobile, otp);
    const user = await prisma.customer.findUnique({
        where: {mobile},
    });
    if (user === null) 
        throw new UnauthorizedError("This user not found.");
    if (user.is_deleted === true) 
        throw new UnauthorizedError("This user already exist & temporarily blocked.");
    if (!isValid) {
        throw new UnauthorizedError("Invalied or expired OTP.");
        }
    return { token:await generateToken(mobile)};
};

module.exports.refreshToken = async (token) => {
     let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new UnauthorizedError("Token has expired.");
        } else if (err.name === 'JsonWebTokenError') {
            throw new UnauthorizedError("Invalid or malformed token");
        } else {
            throw new UnauthorizedError("Token validation failed");
        }
    }

    const mobile = decoded.mobile;

    const user = await prisma.customer.findUnique({
        where: { mobile },
    });

    if (user.is_deleted === true) {
    throw new UnauthorizedError("Cannot generate token for deleted or non-existing user.");
    }

    const expTimestamp = decoded.exp * 1000;
    const currentTime = Date.now();

    const threeMinutes = 3 * 60 * 1000;
    const timeUntilExpiry = expTimestamp - currentTime;

    if (timeUntilExpiry <= threeMinutes && timeUntilExpiry > 0) {
        return generateToken(mobile);
    } else if (timeUntilExpiry <= 0) {
        throw new UnauthorizedError("Token has expired.");
    } else {
        return token;
    }
};

module.exports.findByMobile = async (mobile) => {
    const user = await prisma.customer.findUnique({where: {mobile}});
    if (user === null) 
        throw new UnauthorizedError("This user not found.");
    if (user.is_deleted === true) 
        throw new UnauthorizedError("This user already exist & temporarily blocked.");
    return user;
};

const generateToken =async (mobile) => {
    const user = await prisma.customer.findUnique({ where: { mobile } });
    if (user === null) 
        throw new UnauthorizedError("This user not found.");
    if (user.is_deleted === true) 
        throw new UnauthorizedError("This user already exist & temporarily blocked.");
    return jwt.sign({mobile}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

module.exports.profile = async (mobile) => {
    const customer = await prisma.customer.findUnique({
        where: {mobile, is_deleted: false},
        select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            image: true,
            is_active: true,
        },
    });
    if (!customer) { throw new UnauthorizedError("This user not found."); }
    return customer;
};

module.exports.editProfile = async (mobile, updateData) => {

        const updated = await prisma.customer.update({
            where: { mobile },
            data: updateData,
        });
        if (!updated) { throw new UnauthorizedError("This user not found."); }
    return updated;
    }

