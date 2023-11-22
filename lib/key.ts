import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export class KeyLib {
  private static readonly SECRET = process.env.SECRET!;
  private static readonly IV = Buffer.from(process.env.IV!, "hex");

  private static getCipher(isEncrypt: boolean) {
    const algorithm = "aes-256-ctr";
    const key = Buffer.from(KeyLib.SECRET);
    return isEncrypt
      ? crypto.createCipheriv(algorithm, key, KeyLib.IV)
      : crypto.createDecipheriv(algorithm, key, KeyLib.IV);
  }

  public static generateKey(): string {
    const encryptedApiKey = Buffer.concat([
      KeyLib.getCipher(true).update(uuidv4(), "utf8"),
      KeyLib.getCipher(true).final(),
    ]);

    return `${encryptedApiKey.toString("hex")}`;
  }

  public static encrypt(text: string): string {
    const encrypted = Buffer.concat([
      KeyLib.getCipher(true).update(text, "utf8"),
      KeyLib.getCipher(true).final(),
    ]);

    return encrypted.toString("hex");
  }

  public static decrypt(text: string): string {
    const encryptedText = Buffer.from(text, "hex");
    const decrypted = Buffer.concat([
      KeyLib.getCipher(false).update(encryptedText),
      KeyLib.getCipher(false).final(),
    ]);

    return decrypted.toString("utf8");
  }
}
