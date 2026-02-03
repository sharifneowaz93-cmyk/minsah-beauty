import { PrismaClient, AdminRole, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('Starting database seed...');

  // Create default admin user
  // IMPORTANT: Change this password immediately after first login!
  const adminPassword = await hashPassword('ChangeThisPassword123!');

  const superAdmin = await prisma.adminUser.upsert({
    where: { email: 'admin@minsahbeauty.cloud' },
    update: {},
    create: {
      email: 'admin@minsahbeauty.cloud',
      passwordHash: adminPassword,
      name: 'Super Admin',
      role: AdminRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Created super admin:', superAdmin.email);

  // Create default categories
  const categories = [
    {
      name: 'Skincare',
      slug: 'skincare',
      description: 'Face and body skincare products',
    },
    {
      name: 'Makeup',
      slug: 'makeup',
      description: 'Professional makeup and cosmetics',
    },
    {
      name: 'Hair Care',
      slug: 'hair-care',
      description: 'Shampoos, conditioners, and treatments',
    },
    {
      name: 'Fragrances',
      slug: 'fragrances',
      description: 'Perfumes and body sprays',
    },
    {
      name: 'Bath & Body',
      slug: 'bath-body',
      description: 'Body washes, lotions, and spa products',
    },
    {
      name: 'Nail Care',
      slug: 'nail-care',
      description: 'Nail polish and nail care products',
    },
    {
      name: 'Tools & Brushes',
      slug: 'tools-brushes',
      description: 'Makeup brushes and beauty tools',
    },
    {
      name: 'Gift Sets',
      slug: 'gift-sets',
      description: 'Curated beauty gift sets',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        ...category,
        isActive: true,
        sortOrder: categories.indexOf(category),
      },
    });
  }

  console.log('Created default categories');

  // Create default brands
  const brands = [
    {
      name: 'Minsah Beauty',
      slug: 'minsah-beauty',
      description: 'Our signature brand of premium beauty products',
    },
    {
      name: 'Natural Glow',
      slug: 'natural-glow',
      description: 'Organic and natural beauty products',
    },
    {
      name: 'Luxe Beauty',
      slug: 'luxe-beauty',
      description: 'Premium luxury cosmetics',
    },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: {
        ...brand,
        isActive: true,
      },
    });
  }

  console.log('Created default brands');

  // Create sample products
  const skincareCategory = await prisma.category.findUnique({
    where: { slug: 'skincare' },
  });

  const minsahBrand = await prisma.brand.findUnique({
    where: { slug: 'minsah-beauty' },
  });

  if (skincareCategory && minsahBrand) {
    const products = [
      {
        sku: 'MSB-SKN-001',
        name: 'Hydrating Face Serum',
        slug: 'hydrating-face-serum',
        description: 'A lightweight, hydrating serum that delivers intense moisture to your skin. Formulated with hyaluronic acid and vitamin E.',
        shortDescription: 'Intense hydration serum with hyaluronic acid',
        price: 1299.00,
        compareAtPrice: 1599.00,
        quantity: 100,
        categoryId: skincareCategory.id,
        brandId: minsahBrand.id,
        isActive: true,
        isFeatured: true,
        isNew: true,
      },
      {
        sku: 'MSB-SKN-002',
        name: 'Vitamin C Brightening Cream',
        slug: 'vitamin-c-brightening-cream',
        description: 'Brighten your complexion with this powerful vitamin C cream. Helps reduce dark spots and evens skin tone.',
        shortDescription: 'Brightening cream with vitamin C',
        price: 999.00,
        compareAtPrice: 1199.00,
        quantity: 75,
        categoryId: skincareCategory.id,
        brandId: minsahBrand.id,
        isActive: true,
        isFeatured: true,
        isNew: false,
      },
      {
        sku: 'MSB-SKN-003',
        name: 'Gentle Foaming Cleanser',
        slug: 'gentle-foaming-cleanser',
        description: 'A gentle, sulfate-free foaming cleanser suitable for all skin types. Removes impurities without stripping natural oils.',
        shortDescription: 'Gentle sulfate-free cleanser',
        price: 599.00,
        quantity: 150,
        categoryId: skincareCategory.id,
        brandId: minsahBrand.id,
        isActive: true,
        isFeatured: false,
        isNew: true,
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      });
    }

    console.log('Created sample products');
  }

  // Create sample coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: 'Welcome discount for new customers',
      type: 'PERCENTAGE',
      value: 10,
      minPurchase: 500,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      description: 'Free shipping on orders over 1000 BDT',
      type: 'FREE_SHIPPING',
      value: 0,
      minPurchase: 1000,
      isActive: true,
    },
  });

  console.log('Created sample coupons');

  console.log('Database seed completed successfully!');
  console.log('');
  console.log('IMPORTANT: Default admin credentials:');
  console.log('Email: admin@minsahbeauty.cloud');
  console.log('Password: ChangeThisPassword123!');
  console.log('');
  console.log('Please change this password immediately after first login!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
