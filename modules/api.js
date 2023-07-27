/*
* Functions for Open weather API requests.
*/

const weather = "https://api.openweathermap.org/data/2.5/weather"; //base URL 
async function getWeather(city){
    let wapikey = process.env.WEATHER_API_KEY;
    let reqUrl = `${weather}?q=${city}&appid=${wapikey}&units=metric`;
    
    var response = await fetch(
        reqUrl,
        {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    return await response.json();
}


/*
 * Functions for Spotify API requests.
 */

const https = require('https');

function getAccessToken() {
  return new Promise((resolve, reject) => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    const authOptions = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const tokenReq = https.request(authOptions, (tokenRes) => {
      let data = '';
      tokenRes.on('data', (chunk) => {
        data += chunk;
      });

      tokenRes.on('end', () => {
        if (tokenRes.statusCode === 200) {
          const tokenBody = JSON.parse(data);
          const token = tokenBody.access_token;
          resolve(token);
        } else {
          reject(new Error('Failed to get access token'));
        }
      });
    });

    tokenReq.on('error', (error) => {
      reject(error);
    });

    tokenReq.write('grant_type=client_credentials');
    tokenReq.end();
  });
}

function getMusic(weatherData) {
  return new Promise(async (resolve, reject) => {
    try {
      const accessToken = await getAccessToken();
      const spotify = "https://api.spotify.com/";
      const weatherDes = weatherData.weather[0].main.toLowerCase();

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const randomNum = getRandomInt(0, 10); 
      //console.log(randomNum);

      const reqUrl = `${spotify}/v1/search?q=${weatherDes}+weather&type=playlist&offset=${randomNum}&limit=1`;
      const musicOptions = {
        hostname: 'api.spotify.com',
        path: reqUrl,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        }
      };

      const musicReq = https.request(musicOptions, (musicRes) => {
        let musicData = '';
        musicRes.on('data', (musicChunk) => {
          musicData += musicChunk;
        });

        musicRes.on('end', () => {
          if (musicRes.statusCode === 200) {
            const musicBody = JSON.parse(musicData);
            resolve(musicBody);
          } else {
            reject(new Error('Failed to fetch music data'));
          }
        });
      });

      musicReq.on('error', (error) => {
        reject(error);
      });

      musicReq.end();
    } catch (error) {
      reject(error);
    }
  });
}



module.exports = {
    getWeather,
    getMusic
};