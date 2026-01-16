const bcrypt = require('bcryptjs');
const { sequelize, models } = require('./src/models');
const { User, Role } = models;

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Create Role
        const [adminRole, createdRole] = await Role.findOrCreate({
            where: { name: 'admin' },
            defaults: {
                description: 'Administrator with full access'
            }
        });

        if (createdRole) {
            console.log('Admin Role created.');
        } else {
            console.log('Admin Role already exists.');
        }

        // 2. Create User
        const adminEmail = 'admin@codeaqua.com';
        const adminUsername = 'admin';
        const adminPassword = 'admin123';

        const existingUser = await User.findOne({ where: { username: adminUsername } });
        if (existingUser) {
            console.log('Admin User already exists.');
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                username: adminUsername,
                email: adminEmail,
                password: hashedPassword,
                roleId: adminRole.id, // Assign the role ID
                isActive: true
            });
            console.log(`Admin User created.`);
            console.log(`Username: ${adminUsername}`);
            console.log(`Password: ${adminPassword}`);
        }

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
}

seed();
