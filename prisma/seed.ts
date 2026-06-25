import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.quest.createMany({
    skipDuplicates: true,
    data: [
      { title: 'Daily Hydration', description: 'Log 2L of water today', questType: 'daily', xpReward: 20, startDate: new Date() },
      { title: 'Morning Workout', description: 'Complete any workout before 10am', questType: 'daily', xpReward: 50, startDate: new Date() },
      { title: 'Step Master', description: 'Log 10,000 steps today', questType: 'daily', xpReward: 30, startDate: new Date() },
      { title: '7-Day Streak', description: 'Work out 7 days in a row', questType: 'weekly', xpReward: 200, startDate: new Date() },
    ],
  });

  console.log('Seed complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
