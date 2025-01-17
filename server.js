const express = require('express');
const https = require('https');
const og = require('open-graph');
const cors = require('cors');
const app = express();
const port = 5000; 



app.use(cors()); 

const createSuccessResponse = (data, message) => ({
  success: true,
  message: message || 'Request successful',
  data: data,
});

const createErrorResponse = (message) => ({
  success: false,
  message: message || 'Request failed',
});

const  extractUserInfo = (meta) => {
    console.log(meta);
  
    // Check if the data is valid
    if (meta && meta.description && meta.title && meta.image) {
  
      const description = meta.description;
      const title = meta.title;
      const imageUrl = meta.image.url;
  
      // Use regex to extract followers, following, and posts
      const followersMatch = description.match(/(\d+K?) Followers/);
      const followingMatch = description.match(/(\d+) Following/);
      const postsMatch = description.match(/(\d+) Posts/);
  
      // Extract the values and handle cases where matches are not found
      const followers = followersMatch ? followersMatch[1] : 'N/A';
      const following = followingMatch ? followingMatch[1] : 'N/A';
      const posts = postsMatch ? postsMatch[1] : 'N/A';
  
      // Extract username and name from the title
      const usernameMatch = title.match(/@(\w+)/);
      const username = usernameMatch ? usernameMatch[1] : 'N/A';
      const name = title.split(' • ')[0].replace(/❤️/, '').trim();
  
      return {
        name,
        username,
        followers,
        following,
        posts,
        profilePicture: imageUrl
      };
    } else {
      return {
        name: 'N/A',
        username: 'N/A',
        followers: 'N/A',
        following: 'N/A',
        posts: 'N/A',
        profilePicture: 'N/A'
      };
    }
  }
  

// Instagram info get route
app.get('/instagram/:username', (req, res) => {
  const url = `https://www.instagram.com/${req.params.username}/`;

  og(url, (err, meta) => {
    if (err) {
      return res.json(createErrorResponse('Error fetching data'));
    }

    if (meta?.url) {
      console.log(meta);
      return res.json(createSuccessResponse(null, extractUserInfo(meta)));
    } else {
      return res.json(createErrorResponse('Unable to retrieve Instagram data'));
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
