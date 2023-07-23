const { fdb } = require('../config/fdb');

const getAll = (req, res) => {
  const dbRef = fdb.ref('/Berita');
  
  dbRef.once('value', (snapshot) => {

    res.json(snapshot);
  });
  
}

const getOne = (req, res) => {
  
  const { id } = req.params;
  
  const dbRef = fdb.ref('/Berita/' + id);

  dbRef.once('value')
    .then((snapshot) => {
      res.json(snapshot);
    })
    .catch((error) => {
      res.json(error);
    });
  
}

const getOneByTitle = (req, res) => {
 
  const { title } = req.params;

  const dbRef = fdb.ref('/Berita');

  dbRef
    .orderByChild('title')
    .equalTo(title)
    .once('value')
    .then((snapshot) => {
      res.json(snapshot);
    })
    .catch((error) => {
      res.json(error);
    });
};


const add = async (req, res) => {
  
  const { title, description, imageUrl } = req.body
  // const newsUrl = 'https://exless-official.vercel.app/' + title 
  try {
    const newRef = fdb.ref('/Berita');
    await newRef.push().set({ imageUrl, title, description, });
    res.json('Berita berhasil dibuat!')
  } catch (err){
    res.json(err)
  }
  
}

const update = async (req, res) => {
  
  const { id } = req.params
  const { title, description } = req.body
  
  try {
    const userRef = fdb.ref(`/Berita/${id}`);
    await userRef.update({ title, description });
    res.json('Data berhasil diperbarui');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat memperbarui data');
  }
 
}

const remove = async (req, res) => {
  
  const { id } = req.params
  
  try {
    const ref = fdb.ref(`/Berita/${id}`);
    await ref.remove();
    res.json('Data berhasil dihapus');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat menghapus data');
  }
  
}

module.exports = {
  getAll,
  getOne,
  getOneByTitle,
  add,
  update,
  remove
}
