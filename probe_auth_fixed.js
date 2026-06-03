const credentials = {
  companyName: "Afford Medical Technologies Private Limited",
  clientID: "35fbf6ee-8396-4e37-a4e8-aaba81297596",
  clientSecret: "VMSwvypuRPGDMaNz",
  name: "anmol chauhan",
  email: "chauhananmol260305@gmail.com",
  rollNo: "2338408",
  accessCode: "nwwsKx"
};

async function testAuth() {
  const url = "http://4.224.186.213/evaluation-service/auth";
  try {
    console.log(`Sending POST to ${url}...`);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

testAuth();
