// middleware/ipWhitelist.js
const requestIp = require("request-ip");

// Middleware to restrict access by IP
const ipWhitelist = (req, res, next) => {
  const clientIp = requestIp.getClientIp(req); // Detect client IP
  console.log("Client IP detected:", clientIp);

  // Allowed conditions:
  // 1. Localhost IPv4 (127.0.0.1)
  // 2. Localhost IPv6 (::1)
  // 3. IPv6-mapped localhost (::ffff:127.0.0.1)
  // 4. Any IP in 192.168.0.x (your LAN)
  if (
    clientIp === "127.0.0.1" ||
    clientIp === "::1" ||
    clientIp === "::ffff:127.0.0.1" ||
    (clientIp && clientIp.startsWith("192.168.0."))
  ) {
    return next(); // Allow request
  }

  //If not in allowed list
  return res.status(403).json({ message: "Access denied: IP not allowed" });
};

module.exports = ipWhitelist;