const Joi = require("joi");
const {ValidationError} = require("../model/error/custom.error");

const mobileSchema = Joi.object({
    mobile: Joi.string()
        .regex(/^(?:\+?94|0)?(7[0-9]{8})$/)
        .message("Invalid mobile number")
        .required(),
});

exports.validateMobile = (mobile) => {
    const {error} = mobileSchema.validate({mobile});
    if (error) {
        throw new ValidationError(error.message);
    }
    let normalizedMobile = mobile.replace("+", "");

    if (normalizedMobile.startsWith("0")) {
        normalizedMobile = "94" + normalizedMobile.slice(1);
    } else if (!normalizedMobile.startsWith("94")) {
        normalizedMobile = "94" + normalizedMobile;
    }
    return normalizedMobile;
};
