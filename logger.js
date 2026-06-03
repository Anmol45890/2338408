const axios = require("axios");

let cachedToken = null;

async function getValidToken() {
  if (cachedToken) return cachedToken;
  try {
    const res = await axios.post("http://4.224.186.213/evaluation-service/auth", {
      companyName: "Afford Medical Technologies Private Limited",
      clientID: "35fbf6ee-8396-4e37-a4e8-aaba81297596",
      clientSecret: "VMSwvypuRPGDMaNz",
      name: "anmol chauhan",
      email: "chauhananmol260305@gmail.com",
      rollNo: "2338408",
      accessCode: "nwwsKx"
    });
    cachedToken = res.data.access_token;
    return cachedToken;
  } catch (err) {
    console.error("Logger token renewal failed:", err.message);
    return null;
  }
}

async function Log(stack, level, packageName, message) {
  try {
    const token = await getValidToken();
    const res = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Log success:", res.data);
  } catch (err) {
    if (err.response?.status === 401) {
      // Clear token and retry once
      cachedToken = null;
      try {
        const token = await getValidToken();
        const res = await axios.post(
          "http://4.224.186.213/evaluation-service/logs",
          {
            stack,
            level,
            package: packageName,
            message
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        console.log("Log retry success:", res.data);
        return;
      } catch (retryErr) {
        console.log("Log retry failed:", retryErr.response?.data || retryErr.message);
      }
    }
    console.log("Log failed:", err.response?.data || err.message);
  }
}

module.exports = Log;
