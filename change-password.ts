import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.argv[2] || 'admin@hrdc-srcc.org';
  const newPassword = process.argv[3];

  if (!newPassword) {
    console.error('❌ Please provide a new password.');
    console.log('Usage: npx tsx change-password.ts <email> <newPassword>');
    console.log('Example: npx tsx change-password.ts admin@hrdc-srcc.org MyNewPassword#2026');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters long.');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`❌ User with email "${email}" not found.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`✅ Success! Password for ${email} has been updated.`);
}

main()
  .catch((e) => {
    console.error('Error updating password:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
