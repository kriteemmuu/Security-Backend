const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/activity.log");

const activityLogger = (req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url} - User: ${req.user?.id || "Guest"}\n`;

  fs.appendFile(logFilePath, log, (err) => {
    if (err) console.error("Logging Error:", err);
  });

  next();
};

module.exports = activityLogger;
