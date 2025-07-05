const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;
    // Map status code to status text
    let statusText =
        statusCode === 400 ? "Bad Request" :
        statusCode === 401 ? "Unauthorized" :
        statusCode === 404 ? "Not Found" :
        statusCode === 406 ? "Not Acceptable" :
        "Error";

    res.status(200).json({
        status: statusCode,
        message: statusText,
        error: err.message || 'An error occurred'
    });
};

module.exports = errorMiddleware;