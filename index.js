const { nextISSTimesForMyLocation } = require('./iss');

// * callbacks used for testing each function:
// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP('205.250.246.186', (error, coords) => {
//   if (error) {
//     console.log("It didn't work! " , error);
//     return;
//   }
//   console.log('It worked! Returned Coordinates: ' , coords);
// });

// const { fetchISSFlyOverTimes } = require('./iss');
// const coords = { latitude: '49.89590', longitude: '-119.17240' };
// fetchISSFlyOverTimes(coords, (error, passTimes) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned flyover times:' , passTimes);
// });

const printPassTimes = function(nextPasses) {
  for (const pass of nextPasses) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, nextPasses) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(nextPasses);
});