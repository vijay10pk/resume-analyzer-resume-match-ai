const bcrypt = require('bcryptjs');
const dbUtils = require('../utils/db.utils');

class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.password_hash = data.password_hash;
        this.fullname = data.fullname;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    static async findByEmail(email) {
        try {
            const result = await dbUtils.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0] ? new User(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error finding user by email');
        }
    }

    static async findById(id) {
        try {
            const result = await dbUtils.query(
                'SELECT * FROM users WHERE id = $1',
                [id]
            );
            return result.rows[0] ? new User(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error finding user by id');
        }
    }

    static async create(userData) {
        try {
            if (!this.validateEmail(userData.email)) {
                throw new Error('Invalid email format');
            }

            if (!this.validatePassword(userData.password)) {
                throw new Error('Password must be at least 8 characters long and contain at least one number');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const result = await dbUtils.query(
                `INSERT INTO users (email, password_hash, fullname) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, email, fullname, created_at, updated_at`,
                [userData.email, hashedPassword, userData.fullname]
            );

            return new User(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    async updatePassword(currentPassword, newPassword) {
        try {
            const validPassword = await bcrypt.compare(currentPassword, this.password_hash);
            if (!validPassword) {
                throw new Error('Current password is incorrect');
            }

            if (!User.validatePassword(newPassword)) {
                throw new Error('New password must be at least 8 characters long and contain at least one number');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const result = await dbUtils.query(
                `UPDATE users 
                 SET password_hash = $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $2 
                 RETURNING id, email, created_at, updated_at`,
                [hashedPassword, this.id]
            );

            Object.assign(this, result.rows[0]);
            return this;
        } catch (error) {
            throw error;
        }
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            fullname: this.fullname,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    static async findAll(limit = 10, offset = 0) {
        try {
            const result = await dbUtils.query(
                `SELECT id, email, created_at, updated_at 
                 FROM users 
                 ORDER BY created_at DESC 
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            );
            return result.rows.map(user => new User(user));
        } catch (error) {
            throw new Error('Error fetching users');
        }
    }

    async updateProfile(updateData) {
        try {
            const allowedUpdates = ['email', 'fullname'];
            const updates = {};
            
            Object.keys(updateData).forEach(key => {
                if (allowedUpdates.includes(key)) {
                    updates[key] = updateData[key];
                }
            });

            if (updates.email && !User.validateEmail(updates.email)) {
                throw new Error('Invalid email format');
            }

            if (Object.keys(updates).length === 0) {
                return this;
            }

            const setClause = Object.keys(updates)
                .map((key, index) => `${key} = $${index + 1}`)
                .join(', ');
            
            const values = [...Object.values(updates), this.id];
            
            const result = await dbUtils.query(
                `UPDATE users 
                 SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $${Object.keys(updates).length + 1} 
                 RETURNING id, email, fullname, created_at, updated_at`,
                values
            );

            Object.assign(this, result.rows[0]);
            return this;
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }
}

module.exports = User;
