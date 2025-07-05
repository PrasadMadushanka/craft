const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const { UnauthorizedError } = require("../../model/error/custom.error.js");

class OTPService {
    static async generateOTP(mobile) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        const user = await prisma.customer.findFirst({
            where: { mobile },
        });

        if (!user) {
            throw new UnauthorizedError("This user not found.");
        }

        await prisma.otp.create({
            data: {
                mobile,
                otp: otp.toString(),
                expire_at: expiresAt, 
                email: user.email,
            },
        });

        await this.sendOTP(mobile, otp);
    }

    static async sendOTP(mobile, otp) {
        const url = process.env.SMS_API_URLs || "https://rest.clicksend.com/v3/sms/send";
        const username = process.env.CLICKSEND_USERNAME;
        const apiKey = process.env.CLICKSEND_API_KEY;

        const data = {
            messages: [
                {
                    source: "nodejs",
                    body: `Your OTP is: ${otp}`,
                    to: mobile,
                    schedule: null,
                },
            ],
        };

        await axios.post(url, data, {
            auth: {
                username: username,
                password: apiKey,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    static async verifyOTP(mobile, otp) {
        try {
            const currentTime = new Date();

            const otpEntry = await prisma.otp.findFirst({
                where: {
                    mobile,
                    otp,
                    expire_at: { 
                        gt: currentTime,
                    },
                },
            });

            if (!otpEntry) return false;

            await prisma.otp.delete({
                where: { id: otpEntry.id },
            });

            return true;
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return false;
        }
    }
}

module.exports = OTPService;
