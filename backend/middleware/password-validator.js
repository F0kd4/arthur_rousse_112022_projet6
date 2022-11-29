const passwordValidator = require('password-validator');

//création schéma de mot de passe 
const passwordSchema = new passwordValidator();

//propriétés du schéma
passwordSchema
    .is().min(5)                                    // Minimum length 5
    .is().max(12)                                   // Maximum length 12
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values



module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        //à compléter
        return res.status(400).json({  message: 'Le mdp doit contenir **' });
    }
};