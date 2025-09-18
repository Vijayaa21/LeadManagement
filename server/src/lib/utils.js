import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,   // make sure JWT_SECRET is in your .env
    { expiresIn: "30d" }
  );

  // If you want to set it as a cookie:
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // set to true in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return token;
};

export { generateToken };