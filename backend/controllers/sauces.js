const Sauce = require('../models/Sauce');


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créée.' }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.name })
        .then(() => res.status(200).json({ message: 'Sauce supprimée.' }))
        .catch(error => res.status(400).json({ error }));
}
