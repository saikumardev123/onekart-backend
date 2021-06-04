
var productModel = require('../models/product.model');

exports.add = async (req, res) => {
    let document = new productModel(req.body);
    try {
        let doc = await document.save();
        if (doc)
            res.status(201).send({ success: true, message: "product added successfully!" });
        else
            res.status(404).send({ success: false, message: "Something went wrong" });

    } catch (error) {
        return res.status(500).send({ success: false, message: error.message })
    }
}
