// scripts/createUser.mjs
import bcrypt from 'bcrypt';

const hashed = await bcrypt.hash('Demo@1234', 10);
console.log(hashed);