import crypto from "crypto";

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize();
}

export function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash.toString("hex").normalize());
      }
    });
  });
}

export async function verifyPassword(
  password: string,
  salt: string,
  hashedPassword: string,
): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(hashedPassword, "hex"),
  );
}
