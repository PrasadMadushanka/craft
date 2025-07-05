const validateAndCreateTime = (timeString) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regex pattern for HH:mm format
    if (!timePattern.test(timeString)) {
        throw new Error('Invalid time format. Please use HH:mm format.');
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

module.exports = {validateAndCreateTime}