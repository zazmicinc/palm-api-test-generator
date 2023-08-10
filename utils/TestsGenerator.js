const https = require("https");

  const re = /```/g;

  function parseContent(content) {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(re)) {
        lines[i] = "// " + lines[i];
      }
    }
    return lines.join("\n");
  }

async function generateUnitTest(content, type) {
  return new Promise((resolve, reject) => {


  const postData = JSON.stringify({
    content: content,
    type: type
  });

  const options = {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    path: process.env.PATH,
    method: process.env.METHOD,
    headers: {
        "Content-Type": "application/json"
    }
  };

  console.log("Generating unit test...");
  const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      // Handle the API response here
      const parsedObject = JSON.parse(data);
      if(parsedObject === undefined) { 
        console.log("...Error generating unit test");
        reject("Error generating unit test") 
      } else {
        console.log("...Done");
        let res = parsedObject;
        const parsedContent = parseContent(res);
        resolve(parsedContent);
      }
    });
  });

  req.on("error", (error) => {
    // Handle any errors that occur during the API call
    console.error("Error calling API:", error.message);
    reject(error); // Reject the Promise with the error
  });

  req.write(postData);
  req.end();
});
}

module.exports = {
  generateUnitTest,
};
