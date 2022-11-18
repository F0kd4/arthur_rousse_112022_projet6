const multer = require('multer');


//Dictionnaire des formats de fichiers image
const MIME_TYPE = {
    'image/gif': 'gif',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}



const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        //Remplacer les espaces des noms de fichier par un '_'
        const name = file.originalname.split(' ').join('_');
        //Renommer le fichier en intégrant la date du jour pour éviter les doublons
        const extension = MIME_TYPE[file.mimetype];
        callback(null, name + '_' + Date.now() + '.' + extension);
    }

});
//Préciser la destination du fichier, et qu'on accepte un seul fichier
module.exports = multer({ storage }).single('image');