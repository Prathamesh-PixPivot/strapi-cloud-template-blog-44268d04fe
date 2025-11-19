# ⚡ Quick Start Guide

Get your Strapi blog CMS up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

Create a `.env` file in the root directory:

```bash
# Copy the example (if available) or create manually
cp .env.example .env
```

Minimum required variables:
```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=development
APP_KEYS=key1,key2,key3,key4
JWT_SECRET=your_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret
API_TOKEN_SALT=your_api_token_salt
TRANSFER_TOKEN_SALT=your_transfer_token_salt
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

**Generate secure keys:**
```bash
openssl rand -base64 32  # Run 4 times for APP_KEYS
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For ADMIN_JWT_SECRET
openssl rand -base64 32  # For API_TOKEN_SALT
openssl rand -base64 32  # For TRANSFER_TOKEN_SALT
```

## Step 3: Start Strapi

```bash
npm run develop
```

This will:
- Start the Strapi server on `http://localhost:1337`
- Open the admin panel registration page
- Create the database (SQLite for development)

## Step 4: Create Admin Account

1. Go to `http://localhost:1337/admin`
2. Fill in the registration form:
   - First name
   - Last name
   - Email
   - Password
3. Click **Let's start**

## Step 5: Set Public Permissions

1. In the admin panel, go to **Settings** (gear icon)
2. Click **Users & Permissions Plugin**
3. Click **Roles** → **Public**
4. Under **Permissions**, enable:
   - **Article**: `find` and `findOne` ✅
   - **Category**: `find` and `findOne` ✅
   - **Author**: `find` and `findOne` ✅
5. Click **Save**

## Step 6: Create Your First Content

### Create an Author
1. Go to **Content Manager** → **Author**
2. Click **Create new entry**
3. Fill in name, email, and upload avatar
4. Click **Save**

### Create a Category
1. Go to **Content Manager** → **Category**
2. Click **Create new entry**
3. Fill in name and description
4. Click **Save**

### Create an Article
1. Go to **Content Manager** → **Article**
2. Click **Create new entry**
3. Fill in:
   - Title
   - Description
   - Select author and category
   - Upload cover image
   - Add content blocks
   - Set publish date
   - Toggle **Featured** if needed
   - Fill in SEO fields
4. Click **Save** (draft)
5. Click **Publish** (make it public)

## Step 7: Test the API

Open your browser or use curl:

```bash
# Get all articles
curl http://localhost:1337/api/articles?populate=*

# Get featured articles
curl http://localhost:1337/api/articles/featured?populate=*

# Get recent articles
curl http://localhost:1337/api/articles/recent?limit=5&populate=*
```

Or visit in browser:
- `http://localhost:1337/api/articles?populate=*`

## Step 8: Integrate with Your Frontend

### Example: Fetch Articles (JavaScript)

```javascript
const STRAPI_URL = 'http://localhost:1337';

// Fetch all articles
async function getArticles() {
  const response = await fetch(
    `${STRAPI_URL}/api/articles?populate=*&sort=publishDate:desc`
  );
  const data = await response.json();
  return data.data;
}

// Fetch featured articles
async function getFeaturedArticles() {
  const response = await fetch(
    `${STRAPI_URL}/api/articles/featured?populate=*`
  );
  const data = await response.json();
  return data.data;
}

// Fetch article by slug
async function getArticleBySlug(slug) {
  const response = await fetch(
    `${STRAPI_URL}/api/articles/slug/${slug}?populate=*`
  );
  const data = await response.json();
  return data.data;
}
```

### Example: Next.js Integration

```javascript
// pages/blog/index.js
export async function getStaticProps() {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/articles?populate=*&sort=publishDate:desc`
  );
  const data = await res.json();

  return {
    props: {
      articles: data.data,
    },
    revalidate: 60,
  };
}

export default function Blog({ articles }) {
  return (
    <div>
      <h1>Blog</h1>
      {articles.map((article) => (
        <article key={article.id}>
          <h2>{article.attributes.title}</h2>
          <p>{article.attributes.description}</p>
        </article>
      ))}
    </div>
  );
}
```

## 🎉 You're Ready!

Your Strapi blog CMS is now set up and ready to use!

## Next Steps

1. **Read the full documentation:**
   - [Blog Setup Guide](./BLOG_SETUP_GUIDE.md) - Complete understanding
   - [API Reference](./API_REFERENCE.md) - All endpoints
   - [Configuration Guide](./CONFIGURATION_GUIDE.md) - Production setup

2. **Customize:**
   - Add more fields to content types
   - Create custom components
   - Add more API endpoints

3. **Deploy:**
   - Set up production database
   - Configure environment variables
   - Deploy to Strapi Cloud or your server

## Troubleshooting

### Port 1337 already in use
Change the port in `.env`:
```env
PORT=1338
```

### Database errors
- Make sure `.tmp` directory exists
- Check database file permissions
- For production, verify database credentials

### CORS errors
Update `config/middlewares.js` with your frontend domain:
```javascript
origin: ['http://localhost:3000', 'https://yourdomain.com']
```

### API returns empty results
- Make sure articles are **Published** (not just saved)
- Verify public permissions are set
- Check that `populate=*` is in your API call

## Need Help?

- Check the [Blog Setup Guide](./BLOG_SETUP_GUIDE.md) for detailed explanations
- See [API Reference](./API_REFERENCE.md) for endpoint details
- Visit [Strapi Documentation](https://docs.strapi.io) for general Strapi help

