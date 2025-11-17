import jwt from "jsonwebtoken";

//Function to generate a token for the user
export const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    return token;
}