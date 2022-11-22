const Sauce = require('../models/Sauce');

const fs = require('fs');

//Affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


//Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Nouvelle sauce enregistrée avec succès.' }) })
        .catch(error => res.status(400).json({ error }))
};


//Affichage d'une seule sauce
exports.findOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};


//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' })
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée avec succès.' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-Autorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès.' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
};

//Fonction Like/Dislike
exports.likeDislikeFct = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    // Like
    if (like === 1) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (!sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            // on inc likes de 1
                            $inc: { likes: 1 },
                            // ajout userId dans le tableau des utilisateurs ayant aimé
                            $push: { usersLiked: userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Sauce likée.' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }

    // Dislike
    if (like === -1) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (!sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Sauce dislikée.' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }

    // Fonction pour retirer un vote existant
    if (like === 0) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                // Si le user a déjà liké la sauce
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId },
                        {
                            //on décrémente likes de 1
                            $inc: { likes: -1 },
                            //on retire l'userId des utilisateurs ayant aimé
                            $pull: { usersLiked: userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Like retiré' }))
                        .catch((error) => res.status(400).json({ error }));
                }

                // Si le user a déjà disliké la sauce
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId }
                        }
                    )
                        .then(() => res.status(201).json({ message: 'Dislike retiré' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};