import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  // default_student_password: process.env.DEFAULT_STUDENT_PASSWORD,
  // default_faculty_password: process.env.DEFAULT_FACULY_PASSWORD,
  // default_admin_password: process.env.DEFAULT_ADMIN_PASSWORD,
  forntend_url: 'https://house-crafters-frontend-ivory.vercel.app',
  backend_url: 'https://house-crafters.vercel.app/api/v1',
  ssl_store_id: process.env.SSL_STORE_ID,
  ssl_store_password: process.env.SSL_STORE_PASSWORD,
  ssl_is_live: false,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};

// https://house-crafters-frontend-ivory.vercel.app
// 'http://localhost:3000'

// 'https://house-crafters.vercel.app/api/v1'
// 'http://localhost:5001/api/v1'
