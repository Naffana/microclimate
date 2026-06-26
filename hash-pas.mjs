import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.error("Передай пароль как аргумент: node hash-password.mjs МойПароль");
  process.exit(1);
}

const saltRounds = 10; // обычно 10–12
const hash = await bcrypt.hash(password, saltRounds);

console.log("Пароль:", password);
console.log("Hash:", hash);