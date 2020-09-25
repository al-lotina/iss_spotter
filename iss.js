const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body).data;
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => { 
    if (error) {
      return callback(error, null); 
    }
    // the return value for the ip argument is passed to the nested function as its own argument to perform its logic
    fetchCoordsByIP(ip, (error, coords) => { 
      if (error) {
        return callback(error, null); 
      }
      // the return value for the coords argument is passed to the nested function as its own argument to perform its logic 
      fetchISSFlyOverTimes(coords, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        // the return value for the nextPasses argument is passed to the nested callback
        callback(null, nextPasses); 
      });
    });
  });  
};

module.exports = { nextISSTimesForMyLocation };

