const uploadImage = (req, res, next) => {
    try {
        if (!req.file) {
            const err = new Error("No image file provided");
            err.statusCode = 400;
            return next(err);
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        return res.status(200).json({ url: imageUrl });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadImage
};
