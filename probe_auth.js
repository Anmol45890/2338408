const credentials = {
  companyName: "Afford Medical Technologies Private Limited",
  clientID: "35fbf6ee-8396-4e37-a4e8-aaba81297596",
  clientSecret: "VMSwvypuRPGDMaNz",
  ownerName: "anmol chauhan",
  ownerEmail: "chauhananmol260305@gmail.com",
  rollNo: "2338408",
  accessCode: "nwwsKx"
};

const targets = [
  // 4.224.186.213 targets (the one serving notifications)
  { url: "http://4.224.186.213/evaluation-service/auth", body: credentials },
  { url: "http://4.224.186.213/test/auth", body: credentials },
  { url: "http://4.224.186.213/test/register", body: credentials },
  // 20.244.56.144 targets (the original auth IP in JWT claims)
  { url: "http://20.244.56.144/evaluation-service/auth", body: credentials },
  { url: "http://20.244.56.144/test/auth", body: credentials },
  { url: "http://20.244.56.144/test/register", body: credentials },
];

async function probe() {
  for (const target of targets) {
    try {
      console.log(`Trying POST ${target.url}...`);
      const res = await fetch(target.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target.body)
      });
      const data = await res.json().catch(() => null);
      console.log(`Status:`, res.status);
      console.log(`Response:`, data);
      console.log("-".repeat(50));
    } catch (err) {
      console.error(`Failed ${target.url}:`, err.message);
      console.log("-".repeat(50));
    }
  }
}

probe();
