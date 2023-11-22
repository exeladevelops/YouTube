import { PrismaClient } from "@prisma/client";
import { KeyLib } from "./key";

const prisma = new PrismaClient();

export class UserLib {
  steamid: string;

  constructor(steamid: string) {
    this.steamid = steamid;
  }

  static async createUser(steamid: string): Promise<void> {
    const key = KeyLib.generateKey();
    await prisma.$transaction([
      prisma.users.create({
        data: {
          steamid,
          apiKey: key,
          active: true,
        },
      }),
    ]);
  }

  async getUser(): Promise<any> {
    const user = await prisma.users.findUnique({
      where: {
        steamid: this.steamid,
      },
    });
    return user;
  }

  static async getUserByKey(apiKey: string): Promise<any> {
    const user = await prisma.users.findUnique({
      where: {
        apiKey,
      },
    });
    return user;
  }

  async regenerateApiKey(): Promise<string> {
    const key = KeyLib.generateKey();
    await prisma.users.update({
      where: {
        steamid: this.steamid,
      },
      data: {
        apiKey: key,
      },
    });
    return key;
  }
}
