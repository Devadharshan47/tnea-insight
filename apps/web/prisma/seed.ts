import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create a dummy college
  const ceG = await prisma.college.upsert({
    where: { code: '0001' },
    update: {},
    create: {
      code: '0001',
      name: 'College of Engineering Guindy, Anna University',
      district: 'Chennai',
      type: 'Government',
      fees: 15000,
      naacGrade: 'A++',
      nbaStatus: true,
      nirfRank: 13,
    }
  });

  const mit = await prisma.college.upsert({
    where: { code: '0004' },
    update: {},
    create: {
      code: '0004',
      name: 'Madras Institute of Technology',
      district: 'Chennai',
      type: 'Government Aided',
      fees: 20000,
      naacGrade: 'A+',
      nbaStatus: true,
      nirfRank: 25,
    }
  });

  // 2. Create Branches
  const cseBranch = await prisma.branch.upsert({
    where: { collegeId_code: { code: 'CS', collegeId: ceG.id } },
    update: {},
    create: {
      code: 'CS',
      name: 'Computer Science and Engineering',
      collegeId: ceG.id,
    }
  });

  const eceBranch = await prisma.branch.upsert({
    where: { collegeId_code: { code: 'EC', collegeId: mit.id } },
    update: {},
    create: {
      code: 'EC',
      name: 'Electronics and Communication Engineering',
      collegeId: mit.id,
    }
  });

  // 3. Create Cutoffs
  await prisma.cutoff.upsert({
    where: { collegeId_branchId_year_category: { collegeId: ceG.id, branchId: cseBranch.id, year: 2023, category: 'BC' } },
    update: {},
    create: {
      collegeId: ceG.id,
      branchId: cseBranch.id,
      year: 2023,
      category: 'BC',
      score: 198.5
    }
  });

  await prisma.cutoff.upsert({
    where: { collegeId_branchId_year_category: { collegeId: ceG.id, branchId: cseBranch.id, year: 2024, category: 'BC' } },
    update: {},
    create: {
      collegeId: ceG.id,
      branchId: cseBranch.id,
      year: 2024,
      category: 'BC',
      score: 199.0
    }
  });

  await prisma.cutoff.upsert({
    where: { collegeId_branchId_year_category: { collegeId: mit.id, branchId: eceBranch.id, year: 2023, category: 'BC' } },
    update: {},
    create: {
      collegeId: mit.id,
      branchId: eceBranch.id,
      year: 2023,
      category: 'BC',
      score: 195.0
    }
  });

  await prisma.cutoff.upsert({
    where: { collegeId_branchId_year_category: { collegeId: mit.id, branchId: eceBranch.id, year: 2024, category: 'BC' } },
    update: {},
    create: {
      collegeId: mit.id,
      branchId: eceBranch.id,
      year: 2024,
      category: 'BC',
      score: 196.5
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
