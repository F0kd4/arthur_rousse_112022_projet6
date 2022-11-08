const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créée.' }))
        .catch(error => res.status(400).json({ error }));
}