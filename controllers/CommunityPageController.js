const { admin, fdb } = require('../config/fdb')

const join = async (req, res) => {
  const { idUser, idCommunity } = req.body
  
  if(!idUser) {
    res.json('Silahkan login terlebih dahulu');
    return
  }
  
  try {
  const newRef = fdb.ref(`/Users/${idUser}/Community`);
  const snapshot = await newRef.orderByChild("idCommunity").equalTo(idCommunity).once("value");
  if (!snapshot.exists()) {
    await newRef.push().set({ idCommunity });
    res.json('Join sukses!');
  } else {
    res.json('kamu sudah bergabung dengan komunitas ini');
  }
} catch (err) {
  res.json(err);
}

  
}

const addChat = async (req, res) => {
  
  const { id, userEmail, chatBaru } = req.body
  const waktu = admin.database.ServerValue.TIMESTAMP
  
  try {
    const newRef = fdb.ref(`/Community/${id}/Chat`);
    await newRef.push().set({ waktu, userEmail, chatBaru });
    res.json('Chat sukses!')
  } catch (err){
    res.json(err)
  }
}

const getChat = async (req, res) => {
  
  const { id } = req.body
  
  try {
    const newRef = fdb.ref(`/Community/${id}/Chat`);
    await newRef.push().set({ userEmail, chatBaru });
    res.json('Chat sukses!')
  } catch (err){
    res.json(err)
  }
}

module.exports = {
  join,
  addChat
}