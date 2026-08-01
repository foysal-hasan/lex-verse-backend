import { PrismaClient, UserRole } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const adminEmail = process.env.SYSTEM_EMAIL || 'admin@email.com';
const adminPassword = process.env.SYSTEM_PASSWORD || 'Admin@123!';

async function main() {
  console.log('🌱 Starting Database Seeding...');

  const { adminUser } = await seedUsers();
  await seedTokenRules();
  await seedUniversities();
  await seedUserWallets(adminUser.id);
  await seedDiscussionGroups(adminUser.id);
  await seedPushPromptEvents(adminUser.id);
}

main()
  .then(() => {
    console.log('🎉 All seeding completed successfully!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// -------------------------------------------------------------
// 1. Seed Users & Wallets
// -------------------------------------------------------------
async function seedUsers() {
  console.log('👤 Seeding Users...');

  const adminHashedPassword = await hashPassword(adminPassword);
  const defaultPassword = await hashPassword('12345678');

  // Upsert Admin
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: UserRole.admin,
    },
    create: {
      email: adminEmail,
      password: adminHashedPassword as string,
      name: 'Admin User',
      role: UserRole.admin,
      email_verified_at: new Date(),
    },
  });

  // Seed Mentor & Users
  const additionalUsers = [
    {
      email: 'mentor@email.com',
      name: 'Lead Mentor',
      role: UserRole.mentor,
    },
    {
      email: 'user001@email.com',
      name: 'User 001',
      role: UserRole.user,
    },
    {
      email: 'user002@email.com',
      name: 'User 002',
      role: UserRole.user,
    },
  ];

  for (const u of additionalUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: defaultPassword as string,
        role: u.role,
        email_verified_at: new Date(),
      },
    });
  }

  return { adminUser };
}

// -------------------------------------------------------------
// 2. Seed Token Rules Catalog (token_rules)
// -------------------------------------------------------------
async function seedTokenRules() {
  console.log('🪙 Seeding Token Rules...');

  const rules = [
    { event: 'quiz_join', delta: 2, description: 'Awarded for joining and submitting a quiz' },
    { event: 'quiz_pass_bonus', delta: 5, description: 'Bonus for passing a quiz (>= cut mark)' },
    { event: 'quiz_fail', delta: -1, description: 'Deducted for failing a quiz' },
    { event: 'quiz_skip', delta: -3, description: 'Deducted for skipping a daily task' },
    { event: 'quiz_top10', delta: 10, description: 'Bonus for finishing in top 10' },
    { event: 'quiz_perfect_bonus', delta: 5, description: 'Perfect score bonus on daily task (50% of total marks)' },
    { event: 'unlock_quiz', delta: 0, description: 'Unlock spend for a premium quiz' },
    { event: 'unlock_course', delta: 0, description: 'Unlock spend for a premium course' },
    { event: 'unlock_book', delta: 0, description: 'Unlock spend for a premium book' },
    { event: 'unlock_qbank', delta: 0, description: 'Unlock spend for a question bank' },
  ];

  for (const rule of rules) {
    await prisma.tokenRule.upsert({
      where: { event: rule.event },
      update: { delta: rule.delta, description: rule.description },
      create: rule,
    });
  }
}

// -------------------------------------------------------------
// 3. Seed Universities (public.universities)
// -------------------------------------------------------------
async function seedUniversities() {
  console.log('🏛️ Seeding Universities...');

  const universities = [
    // Public Universities
    { name: 'University of Dhaka', type: 'public' },
    { name: 'Jahangirnagar University', type: 'public' },
    { name: 'Jagannath University', type: 'public' },
    { name: 'University of Rajshahi', type: 'public' },
    { name: 'University of Chittagong', type: 'public' },
    { name: 'Islamic University', type: 'public' },
    { name: 'University of Khulna', type: 'public' },
    { name: 'Shahjalal University of Science and Technology', type: 'public' },
    { name: 'Begum Rokeya University', type: 'public' },
    { name: 'Comilla University', type: 'public' },
    { name: 'National University', type: 'public' },
    { name: 'Mawlana Bhashani Science and Technology University', type: 'public' },
    { name: 'Bangabandhu Sheikh Mujibur Rahman Science and Technology University', type: 'public' },
    { name: 'Bangladesh University of Professionals', type: 'public' },

    // Private Universities
    { name: 'BRAC University', type: 'private' },
    { name: 'North South University', type: 'private' },
    { name: 'East West University', type: 'private' },
    { name: 'Independent University, Bangladesh', type: 'private' },
    { name: 'Daffodil International University', type: 'private' },
    { name: 'Green University of Bangladesh', type: 'private' },
    { name: 'Stamford University Bangladesh', type: 'private' },
    { name: 'American International University-Bangladesh', type: 'private' },
    { name: 'City University', type: 'private' },
    { name: 'Leading University', type: 'private' },
    { name: 'University of Asia Pacific', type: 'private' },

    // Other Universities
    { name: 'Bangladesh University of Business and Technology', type: 'other' },
    { name: 'Uttara University', type: 'other' },
    { name: 'Northern University Bangladesh', type: 'other' },
    { name: 'North East University Bangladesh', type: 'other' },
    { name: 'Southern University Bangladesh', type: 'other' },
    { name: 'Port City International University', type: 'other' },
  ];

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { name: uni.name },
      update: { type: uni.type },
      create: {
        name: uni.name,
        type: uni.type,
      },
    });
  }
}

// -------------------------------------------------------------
// 4. Seed User Wallets & Transactions
// -------------------------------------------------------------
async function seedUserWallets(adminUserId: string) {
  console.log('💼 Seeding User Token Wallet...');

  await prisma.userToken.upsert({
    where: { user_id: adminUserId },
    update: {},
    create: {
      user_id: adminUserId,
      balance: 100,
      lifetime_earned: 100,
    },
  });

  // Initial bonus transaction log
  const txRef = {
    user_id: adminUserId,
    reason: 'initial_seed_bonus',
    ref_type: 'system',
    ref_id: 'seed',
  };

  const existingTx = await prisma.tokenTransaction.findFirst({
    where: txRef,
  });

  if (!existingTx) {
    await prisma.tokenTransaction.create({
      data: {
        ...txRef,
        delta: 100,
      },
    });
  }
}

// -------------------------------------------------------------
// 5. Seed Discussion Groups
// -------------------------------------------------------------
async function seedDiscussionGroups(adminUserId: string) {
  console.log('💬 Seeding Discussion Groups...');

  const groupName = 'General Discussion & Study Help';

  const existingGroup = await prisma.discussionGroup.findFirst({
    where: { name: groupName },
  });

  if (!existingGroup) {
    await prisma.discussionGroup.create({
      data: {
        name: groupName,
        description: 'Official group for all members to share updates and discuss topics.',
        type: 'public',
        join_mode: 'manual_approval',
        posting_permission: 'everyone',
        created_by: adminUserId,
        is_active: true,
        max_members: 500,
        members: {
          create: {
            user_id: adminUserId,
            role: 'admin',
            status: 'active',
          },
        },
      },
    });
  }
}

// -------------------------------------------------------------
// 6. Seed Push Prompt Events
// -------------------------------------------------------------
async function seedPushPromptEvents(adminUserId: string) {
  console.log('🔔 Seeding Sample Push Prompt Events...');

  const count = await prisma.pushPromptEvent.count({
    where: { user_id: adminUserId },
  });

  if (count === 0) {
    await prisma.pushPromptEvent.create({
      data: {
        user_id: adminUserId,
        event: 'prompt_shown',
        variant: 'modal_v1',
        meta: { source: 'seed' },
      },
    });
  }
}