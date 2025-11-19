# 🔧 Configuration Guide

## Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Application
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# App Keys (Generate with: openssl rand -base64 32)
# Required for production - Generate 4 different keys
APP_KEYS=your_key_1,your_key_2,your_key_3,your_key_4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Database Configuration
# For SQLite (Development)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# For PostgreSQL (Production - Recommended)
# DATABASE_CLIENT=postgres
# DATABASE_HOST=your_db_host
# DATABASE_PORT=5432
# DATABASE_NAME=strapi_blog
# DATABASE_USERNAME=strapi_user
# DATABASE_PASSWORD=your_secure_password
# DATABASE_SSL=true
# DATABASE_SCHEMA=public

# For MySQL (Alternative)
# DATABASE_CLIENT=mysql
# DATABASE_HOST=your_db_host
# DATABASE_PORT=3306
# DATABASE_NAME=strapi_blog
# DATABASE_USERNAME=strapi_user
# DATABASE_PASSWORD=your_secure_password
# DATABASE_SSL=false
```

## Generating Secure Keys

Run these commands to generate secure random keys:

```bash
# Generate APP_KEYS (run 4 times, use comma-separated values)
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32

# Generate ADMIN_JWT_SECRET
openssl rand -base64 32

# Generate API_TOKEN_SALT
openssl rand -base64 32

# Generate TRANSFER_TOKEN_SALT
openssl rand -base64 32
```

## CORS Configuration

Update `config/middlewares.js` for production:

Replace:
```javascript
origin: ['*'], // Development
```

With:
```javascript
origin: ['https://yourdomain.com', 'https://www.yourdomain.com'], // Production
```

## Database Migration

After changing database configuration:

1. **Backup existing data** (if any)
2. Update `.env` with new database credentials
3. Restart Strapi:
   ```bash
   npm run develop
   ```
4. Strapi will automatically migrate the schema

## Production Checklist

- [ ] Generate all secure keys
- [ ] Set up PostgreSQL database
- [ ] Update CORS with frontend domain
- [ ] Configure environment variables
- [ ] Set up media storage (Cloudinary/S3)
- [ ] Configure email settings (optional)
- [ ] Set up SSL certificates
- [ ] Configure backup strategy
- [ ] Set up monitoring

