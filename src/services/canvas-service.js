const axios = require('axios');

const accessToken = process.env.CANVAS_TOKEN;

const tokenHeader = {
  Authorization: `Bearer ${accessToken}`,
};

function isIterable(obj) {
  return obj !== null && typeof obj[Symbol.iterator] === 'function';
}

function getNextPageUrl(linkHeader) {
  try {
    console.log("---- changing to next page ----")
    const links = linkHeader.split(',');
    for (const link of links) {
        const [url, rel] = link.split('; ');
        if (rel.includes('next')) {
            return url.slice(1, -1); // Remove angle brackets around URL
        }
    }
    return null; // No next page link
  }
  catch(err){
    console.log(err)
  }
}

var domain = 'usu.instructure.com';

// Returns a Promise that resolves to an array containing other associative arrays containing the JSON information
// Endpoints that give a single result will result in an array of length 1 being returned
async function curlGet(url) {

  try {

    const params = {
      per_page: 500, // Number of assignments to retrieve per request
    };

    var results = [];
    // const response = await axios.get(url.startsWith(domain) ? url : `https://${domain}/api/v1/${url}`, {
    //   headers: tokenHeader,
    // });

    // const data = response.data;
    
    // if (data.length === 0) {
    //   return null;
    // }

    let api_url = url.startsWith(domain) ? url : `https://${domain}/api/v1/${url}`;

    while (api_url) {
      try {
          const response = await axios.get(api_url, {
            headers: tokenHeader, 
            params: params
          });

          const data = response.data;

          if(isIterable(data)){
            results.push(...data);
          }
          else {
            return data
          }

          // Check if there are more discussions
          const linkHeader = response.headers.link;
          if (linkHeader) {
              const nextPageUrl = getNextPageUrl(linkHeader);
              if (nextPageUrl) {
                api_url = nextPageUrl;
              } else {
                break; // No more discussions
              }
          } else {
            break; // No link header, assume no more discussions
          }
      } catch (error) {
          console.error(`Error fetching: ${error}`);
          break;
      }
  }

    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function curlPut(url, data) {
  try {
    // Perform the PUT request using axios
    const response = await axios.put(`https://usu.instructure.com/api/v1/${url}`, data, {
      headers: tokenHeader,
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle errors
    throw new Error(`Error in curlPut: ${error.message}`);
  }
}


module.exports = {
    curlGet,
    curlPut
}