import bcrypt from "bcryptjs";

export const generateEhsasId = (yearOfLeaving, count) => {
  const yearSuffix = String(yearOfLeaving).slice(-2);
  return `EH${yearSuffix}${String(count).padStart(4, "0")}`;
};

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

export const verifyPassword = (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
};
