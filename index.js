const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router');
const { fdb } = require('./config/fdb');

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const { Readable } = require('stream');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(router);

const clientId = '410698574484-kin0sq2iajftc37ivrer23lfos3ff926.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'https://exless-fujisantoso134.b4a.run/callback';

//const redirectUri = 'http://localhost:3000/callback'

const oauth2Client = new OAuth2Client({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri
});

const scopes = ['https://www.googleapis.com/auth/youtube.upload'];

let accessToken = null;
let refreshToken = null;

app.get('/auth/url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  res.status(200).json({ url: url });
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    oauth2Client.setCredentials(tokens);
    // res.redirect('https://exless-official.vercel.app/add/video');
    res.status(302).header('Location', 'http://localhost:5173/add/video').end();
  } catch (error) {
    // res.redirect('https://exless-official.vercel.app/data/video');
    res.status(500).header('Location', 'http://localhost:5173/data/video').end();

  }
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/video', upload.single('video'), async (req, res) => {
  

  const { title, description, thumbnail } = req.body;
  const videoFile = req.file;

  try {

    const videoStream = new Readable();
    videoStream.push(videoFile.buffer);
    videoStream.push(null);


    const response = await youtube.videos.insert({
      part: ['snippet,status'],
      requestBody: {
        snippet: {
          title,
          description,
          thumbnails: {
            default: {
              url: thumbnail
            }
          }
        },
        status: {
          privacyStatus: 'public',
        },
      },
      media: {
        mimeType: 'video/*',
        body: videoStream,
      },
    });

    const videoId = response.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
   
    try {
      const newRef = fdb.ref('/Video');
      await newRef.push().set({ title, thumbnail, videoUrl, description });
      res.json('Video berhasil dibuat!')
    } catch (err){
      res.json(err)
    }
    
  } catch (error) {
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
