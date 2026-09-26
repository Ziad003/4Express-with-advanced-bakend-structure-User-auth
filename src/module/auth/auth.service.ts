import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payLoad: {
  email: string;
  password: string;
}) => {
  const { email, password } = payLoad;
  //1.Check if the user exists
  //2.Compare the password
  //3.Generate token

  //1.Check if the user exists
  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  const user = userData.rows[0];
  if (!user) {
    throw new Error("Invalid Credentials!");
  }

  //2.Compare the password
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  //3.Generate token
  const jwtpayload = {
    id: user.id,
    name: user.name,
    role:user.role,
    age: user.age,
    email: user.email,
  };
  const accessToken = jwt.sign(jwtpayload, config.secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
};
