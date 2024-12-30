import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {

    // const token = req.cookies.jwt;
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;
   
    console.log("Authorization header token:", req.headers.authorization?.split(" ")[1]);
console.log("Cookie token:", req.cookies.jwt);
console.log("Final token:", token); // The `token` variable in your middleware






    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};






// -----------------------------------------------





// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protectRoute = (req, res, next) => {
//   let token;

//   // Check for token in Authorization header
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies.jwt) {
//     // Check for token in cookies
//     token = req.cookies.jwt;
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: decoded.userId };
//     next();
//   } catch (error) {
//     console.log("Error in protectRoute middleware:", error.message);
//     res.status(401).json({ message: "Not authorized, invalid token" });
//   }
// };