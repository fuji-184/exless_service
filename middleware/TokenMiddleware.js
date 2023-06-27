const { admin } = require('../config/fdb');

const cekToken = (req, res, next) => {
  const token = req.headers.authorization; 
  if (!token) {
    return res.status(401).json('Token akses tidak tersedia'); 
  }

  const adminRef = admin.database().ref('Admin').orderByChild('accessToken').equalTo(token);

  adminRef.once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {

        req.user = snapshot.val()[0]; 
        next();
      } else {
        return res.status(401).json('Token akses tidak valid'); 
      }
    })
    .catch((error) => {
      console.error('Error verifying access token:', error);
      return res.status(500).json('Terjadi kesalahan dalam memverifikasi token'); 
    });
};

module.exports = {
  cekToken
}