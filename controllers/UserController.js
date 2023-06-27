const { admin, fdb } = require('../config/fdb');
 
const add = async (req, res) => {

const { email, password, role } = req.body


if (!email || !password) {
  res.json('Field tidak boleh kosong')
  return
}


  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    const updatedUserRecord = await admin.auth().updateUser(userRecord.uid, {
      email: email,
      emailVerified: true,
      password: password,
    });

    const uid = updatedUserRecord.uid;
    
    if (role === 'admin') {


    const adminRef = fdb.ref('/Admin');
    const adminSnapshot = await adminRef.once('value');
    const adminData = adminSnapshot.val();

    if (!adminData) {

      await adminRef.set({});
    }

    const newAdminRef = adminRef.child(uid);
    const adminData1 = {
      email: email,

    };

    await newAdminRef.set(adminData1);

    res.json({ message: 'Akun admin berhasil dibuat!' });
    return
    }
    res.json({ message: 'Akun user berhasil dibuat!', idUser: uid, emailUser: updatedUserRecord.email, user: 'y' });
  } catch (error) {
    res.status(500).json({ error: 'Error menyimpan akun: ' + error });
  }
};






const getAll = async (req, res) => {
  try {

    const snapshot = await fdb.ref('/Admin').once('value');
    const adminUIDs = snapshot.val();


    const userRecords = await admin.auth().listUsers();
    const users = userRecords.users.filter((user) => {

      return !adminUIDs[user.uid];
    }).map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName

    }));

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
}





module.exports = {
  add,
  getAll
};


