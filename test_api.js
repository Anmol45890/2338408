const fs = require("fs");
const path = require("path");

const loggerContent = fs.readFileSync(path.join(__dirname, "logger.js"), "utf8");
const match = loggerContent.match(/const TOKEN = \"([^\"]+)\";/);
if (!match) {
  console.error("Could not find TOKEN in logger.js");
  process.exit(1);
}
const token = match[1];

async function testPage(page, limit) {
  try {
    const res = await fetch(`http://4.224.186.213/evaluation-service/notifications?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log(`Page ${page} (limit ${limit}) status:`, res.status);
    console.log(`Count:`, data.notifications ? data.notifications.length : data);
    if (data.notifications && data.notifications.length > 0) {
      console.log(`First item ID:`, data.notifications[0].ID);
    }
  } catch (err) {
    console.error(`Page ${page} failed:`, err.message);
  }
}

async function run() {
  await testPage(1, 10);
  await testPage(2, 10);
  await testPage(3, 10);
  await testPage(4, 10);
  await testPage(5, 10);
  await testPage(6, 10);
}

run();
