import jwt from "jsonwebtoken";

export const generateTokens = (adminId) => {
    const accesstoken = jwt.sign({adminId}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    const refreshtoken = jwt.sign({adminId}, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    const refreshtokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return {accesstoken, refreshtoken, refreshtokenExpires}

};