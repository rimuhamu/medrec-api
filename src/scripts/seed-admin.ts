import { authService } from '@/services/auth.service';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminpassword123';

async function seedAdmin() {
  try {
    console.log(`Seeding admin user: ${ADMIN_USERNAME}`);
    const result = await authService.registerAdmin(
      ADMIN_USERNAME,
      ADMIN_PASSWORD
    );
    console.log('Admin user created successfully:', result.user);
    console.log('Token (for testing):', result.token);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
