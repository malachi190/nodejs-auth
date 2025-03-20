const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // get authorization token from headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // check if token does not exist in the request and return an error message
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // decode token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);

    // get user info and compare to the decoded token
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occured",
      error: error,
    });
  }
};

module.exports = authMiddleware;
