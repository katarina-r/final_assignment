import * as fs from 'fs/promises';
import * as path from 'path';
import dotenv from 'dotenv';
import { User } from '../types/types';


dotenv.config();

export async function loadTestData(filePath: string): Promise<User[]> {
  const fullPath = path.resolve(__dirname, filePath);
  const data = await fs.readFile(fullPath, 'utf-8');
  const testData = JSON.parse(data);

  return testData.users.map(user => {
    let password: string | undefined;

    if (user.username === 'Consumer' || user.username === 'Business') {
      password = process.env.VALIDPASSWORD;
    } else if (user.username === 'InvalidUser') {
      password = process.env.INVALIDPASSWORD;
    }

    if (!password) {
      throw new Error(`Password for ${user.username} is invalid`);
    }

    return { ...user, password };
  });
}
