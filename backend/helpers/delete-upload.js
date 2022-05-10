const fs = require('fs')

const deleteImage = (filePath) =>{
   fs.unlink(filePath, function (err) {
       if (err) throw err;
   });
}


module.exports = deleteImage