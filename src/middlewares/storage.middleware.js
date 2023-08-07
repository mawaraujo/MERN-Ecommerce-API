const multer = require('multer')

const DEST_FOLDER = '/upload'

const FILE_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/webp': 'webp'
}

exports.createStorage = (folder = DEST_FOLDER, mimes = FILE_TYPES) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = mimes[file.mimetype]
      let uploadError = new Error('Invalid image type')

      if (isValid) {
        uploadError = null
      }

      cb(uploadError, `public${folder}`)
    },
    filename: function (req, file, cb) {
      const filename = file.originalname.split(' ').join('-')
      const extension = mimes[file.mimetype]

      cb(null, `${filename}-${Date.now()}.${extension}`)
    }
  })

  const upload = multer({ storage })

  return upload
}
