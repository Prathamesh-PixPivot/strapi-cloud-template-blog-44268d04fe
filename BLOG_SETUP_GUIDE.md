# 📝 Professional Blog Setup Guide for Strapi

This guide will help you understand and configure your Strapi blog CMS for your product website.

## 🎯 Overview

Your Strapi instance is configured as a headless CMS (Content Management System) that provides blog content via REST API endpoints. This means you can manage your blog content in Strapi's admin panel, and your product website can fetch and display that content.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Content Types Explained](#content-types-explained)
3. [API Endpoints](#api-endpoints)
4. [Configuration](#configuration)
5. [Setting Up Permissions](#setting-up-permissions)
6. [Creating Your First Blog Post](#creating-your-first-blog-post)
7. [Frontend Integration](#frontend-integration)
8. [Deployment Checklist](#deployment-checklist)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  Product        │  HTTP   │   Strapi     │  SQL    │   Database      │
│  Website        │◄───────►│   Backend    │◄───────►│   (PostgreSQL/  │
│  (Frontend)     │  REST   │   (API)      │         │    MySQL/SQLite)│
└─────────────────┘         └──────────────┘         └─────────────────┘
                                      │
                                      │ Admin Panel
                                      ▼
                              ┌──────────────┐
                              │   Content    │
                              │   Editors    │
                              └──────────────┘
```

**How it works:**
1. Content editors use Strapi Admin Panel to create/edit blog posts
2. Strapi stores content in the database
3. Your product website makes HTTP requests to Strapi API
4. Strapi returns JSON data with blog content
5. Your website renders the content

---

## 📚 Content Types Explained

### 1. **Article** (Blog Posts)
The main content type for your blog posts.

**Fields:**
- `title` (String, Required) - Blog post title
- `description` (Text, Max 300 chars) - Short excerpt/description
- `slug` (UID, Auto-generated) - URL-friendly identifier (e.g., "my-blog-post")
- `cover` (Media) - Featured image for the blog post
- `author` (Relation) - Links to Author content type
- `category` (Relation) - Links to Category content type
- `blocks` (Dynamic Zone) - Flexible content blocks (rich text, images, quotes, sliders)
- `publishDate` (DateTime) - When the post was/will be published
- `readingTime` (Integer) - Estimated reading time in minutes
- `featured` (Boolean) - Mark posts as featured
- `seo` (Component) - SEO metadata (meta title, description, keywords, etc.)
- `tags` (JSON) - Array of tags for categorization

**Draft & Publish:**
- Articles support draft mode - you can save without publishing
- Only published articles appear in public API responses

### 2. **Category**
Organize articles into categories (e.g., "Technology", "Product Updates", "Tutorials").

**Fields:**
- `name` (String) - Category name
- `slug` (UID) - URL-friendly identifier
- `description` (Text) - Category description
- `articles` (Relation) - Reverse relation to articles

### 3. **Author**
Store author information for blog posts.

**Fields:**
- `name` (String) - Author's name
- `email` (String) - Author's email
- `avatar` (Media) - Author's profile picture
- `articles` (Relation) - Reverse relation to articles

### 4. **About** (Optional)
Static content type for "About" page content.

### 5. **Global** (Optional)
Global settings/content that can be reused across the site.

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:1337/api  (Development)
https://your-strapi-domain.com/api  (Production)
```

### Standard REST Endpoints

#### Get All Articles
```
GET /api/articles
```

**Query Parameters:**
- `populate=*` - Include all relations
- `populate[author][populate]=avatar` - Populate author with avatar
- `populate[category]=*` - Populate category
- `filters[featured][$eq]=true` - Filter featured articles
- `sort=publishDate:desc` - Sort by publish date
- `pagination[page]=1` - Page number
- `pagination[pageSize]=10` - Items per page

**Example:**
```bash
GET /api/articles?populate=*&sort=publishDate:desc&pagination[pageSize]=10
```

#### Get Single Article
```
GET /api/articles/:id
```

**Example:**
```bash
GET /api/articles/1?populate=*
```

### Custom Endpoints

#### Get Featured Articles
```
GET /api/articles/featured
```
Returns all articles where `featured = true` and are published.

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Featured Blog Post",
        "slug": "featured-blog-post",
        "description": "This is a featured post",
        "featured": true,
        "publishDate": "2024-01-15T10:00:00.000Z",
        "readingTime": 5,
        "cover": { ... },
        "author": { ... },
        "category": { ... }
      }
    }
  ],
  "meta": { ... }
}
```

#### Get Recent Articles
```
GET /api/articles/recent?limit=10
```
Returns the most recent published articles.

**Query Parameters:**
- `limit` (default: 10) - Number of articles to return

#### Get Articles by Category
```
GET /api/articles/category/:slug
```
Returns all published articles in a specific category.

**Example:**
```bash
GET /api/articles/category/technology
```

#### Get Article by Slug
```
GET /api/articles/slug/:slug
```
Get a single article by its slug (useful for SEO-friendly URLs).

**Example:**
```bash
GET /api/articles/slug/my-blog-post
```

#### Get Related Articles
```
GET /api/articles/related?slug=my-blog-post&limit=3
```
Get articles related to a specific article (same category, excluding the current article).

**Query Parameters:**
- `slug` (required) - Slug of the current article
- `limit` (default: 3) - Number of related articles

#### Get All Categories
```
GET /api/categories?populate=*
```

#### Get All Authors
```
GET /api/authors?populate=*
```

---

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Key Variables:**

1. **APP_KEYS** - Generate secure random keys:
   ```bash
   openssl rand -base64 32
   ```
   Repeat 4 times for APP_KEYS (comma-separated)

2. **Database Configuration:**
   - Development: Use SQLite (default)
   - Production: Use PostgreSQL or MySQL

3. **CORS Configuration:**
   - Update `config/middlewares.js` with your frontend domain in production
   - Replace `origin: ['*']` with `origin: ['https://yourdomain.com']`

### Database Setup

**For Production (PostgreSQL):**
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi_blog
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure_password
DATABASE_SSL=true
```

**For Development (SQLite):**
```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

---

## 🔐 Setting Up Permissions

After starting Strapi, you need to configure public API access:

1. **Start Strapi:**
   ```bash
   npm run develop
   ```

2. **Access Admin Panel:**
   - Go to `http://localhost:1337/admin`
   - Create your admin account (first time only)

3. **Configure Public Permissions:**
   - Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
   - Enable permissions for:
     - `Article`: `find` and `findOne`
     - `Category`: `find` and `findOne`
     - `Author`: `find` and `findOne`
   - Click **Save**

4. **Optional - Create API Token:**
   - Go to **Settings** → **API Tokens**
   - Create a new token with **Read-only** access
   - Use this token in your frontend for authenticated requests

---

## ✍️ Creating Your First Blog Post

### Step 1: Create an Author
1. Go to **Content Manager** → **Author**
2. Click **Create new entry**
3. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Avatar: Upload a profile picture
4. Click **Save**

### Step 2: Create a Category
1. Go to **Content Manager** → **Category**
2. Click **Create new entry**
3. Fill in:
   - Name: "Product Updates"
   - Slug: "product-updates" (auto-generated)
   - Description: "Latest updates about our product"
4. Click **Save**

### Step 3: Create an Article
1. Go to **Content Manager** → **Article**
2. Click **Create new entry**
3. Fill in the form:
   - **Title**: "Welcome to Our Blog"
   - **Description**: "This is our first blog post..."
   - **Slug**: Auto-generated from title
   - **Cover**: Upload a featured image
   - **Author**: Select the author you created
   - **Category**: Select the category you created
   - **Publish Date**: Set to current date/time
   - **Reading Time**: 5 (minutes)
   - **Featured**: Toggle ON if you want it featured
   - **SEO** (expand section):
     - Meta Title: "Welcome to Our Blog | Your Company"
     - Meta Description: "Read about our latest updates..."
     - Keywords: "blog, updates, company"
   - **Blocks**: Add content blocks:
     - Click **Add a component**
     - Choose **Rich text** for paragraphs
     - Choose **Media** for images
     - Choose **Quote** for quotes
4. Click **Save** (saves as draft)
5. Click **Publish** (makes it public)

### Step 4: Verify
Test the API endpoint:
```bash
curl http://localhost:1337/api/articles?populate=*
```

---

## ✍️ Creating Posts via API

Yes! You can create blog posts through the API. This is perfect for:
- Automated content publishing
- Importing content from other systems
- Building custom admin interfaces
- Integrating with third-party services

**See [API Write Guide](./API_WRITE_GUIDE.md) for complete documentation on:**
- Setting up API tokens
- Creating articles with all fields
- Uploading images
- Working with content blocks
- Complete code examples

**Quick Example:**
```javascript
// Create article via API
const response = await fetch('https://your-strapi-domain.com/api/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
  },
  body: JSON.stringify({
    data: {
      title: 'My Blog Post',
      description: 'Description here',
      author: 1,
      category: 1,
      blocks: [
        {
          __component: 'shared.rich-text',
          body: '<p>Content here</p>',
        },
      ],
    },
  }),
});
```

---

## 🌐 Frontend Integration

### Example: Fetching Articles in React

```javascript
// Fetch all articles
const fetchArticles = async () => {
  const response = await fetch(
    'https://your-strapi-domain.com/api/articles?populate=*&sort=publishDate:desc'
  );
  const data = await response.json();
  return data.data;
};

// Fetch single article by slug
const fetchArticleBySlug = async (slug) => {
  const response = await fetch(
    `https://your-strapi-domain.com/api/articles/slug/${slug}?populate=*`
  );
  const data = await response.json();
  return data.data;
};

// Fetch featured articles
const fetchFeaturedArticles = async () => {
  const response = await fetch(
    'https://your-strapi-domain.com/api/articles/featured?populate=*'
  );
  const data = await response.json();
  return data.data;
};
```

### Example: Fetching in Next.js

```javascript
// pages/blog/index.js or app/blog/page.js
export async function getStaticProps() {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/articles?populate=*&sort=publishDate:desc`
  );
  const data = await res.json();

  return {
    props: {
      articles: data.data,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
```

### Handling Images

Strapi returns relative URLs for media. You need to prepend your Strapi URL:

```javascript
const getImageUrl = (image) => {
  if (!image) return '/default-image.jpg';
  
  const url = image.attributes?.url;
  if (url?.startsWith('http')) return url;
  
  return `${process.env.STRAPI_URL}${url}`;
};

// Usage
<img src={getImageUrl(article.attributes.cover)} alt={article.attributes.title} />
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Generate secure `APP_KEYS` and JWT secrets
- [ ] Set up production database (PostgreSQL recommended)
- [ ] Update CORS settings with your frontend domain
- [ ] Configure environment variables
- [ ] Test all API endpoints
- [ ] Set up media storage (Cloudinary, AWS S3, etc.)
- [ ] Configure email settings (if needed)

### Strapi Cloud Deployment

1. **Build your Strapi project:**
   ```bash
   npm run build
   ```

2. **Deploy to Strapi Cloud:**
   ```bash
   npm run deploy
   ```
   Or use the Strapi Cloud dashboard.

3. **Configure Environment Variables:**
   - Add all required environment variables in Strapi Cloud dashboard
   - Set `NODE_ENV=production`
   - Configure database connection string

4. **Set Permissions:**
   - Access your deployed admin panel
   - Configure public permissions as described above

### Post-Deployment

- [ ] Test admin panel access
- [ ] Verify API endpoints are accessible
- [ ] Test CORS with your frontend
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategy for database
- [ ] Set up CDN for media files (optional but recommended)

---

## 📖 Understanding the File Structure

```
strapi-cloud-template-blog/
├── config/                 # Configuration files
│   ├── database.js        # Database configuration
│   ├── server.js          # Server settings
│   ├── middlewares.js     # CORS, security, etc.
│   └── plugins.js          # Plugin configurations
├── src/
│   ├── api/               # API endpoints and logic
│   │   ├── article/       # Article content type
│   │   │   ├── controllers/  # Business logic
│   │   │   ├── routes/       # API routes
│   │   │   ├── services/     # Data services
│   │   │   └── content-types/ # Schema definitions
│   │   ├── author/        # Author content type
│   │   └── category/      # Category content type
│   ├── components/        # Reusable components (SEO, Rich text, etc.)
│   └── bootstrap.js       # Startup logic
├── public/                # Static files
├── .env                   # Environment variables (not in git)
└── package.json           # Dependencies
```

---

## 🔧 Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Update `config/middlewares.js` with your frontend domain:
```javascript
origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
```

### Issue: Images Not Loading
**Solution:** Ensure media URLs are properly formatted:
```javascript
const imageUrl = image?.url?.startsWith('http') 
  ? image.url 
  : `${STRAPI_URL}${image.url}`;
```

### Issue: API Returns Empty Results
**Solution:** 
1. Check that articles are **Published** (not just saved)
2. Verify public permissions are set
3. Check `populate` parameter in API calls

### Issue: Slug Not Working
**Solution:** Ensure slug field is populated. It auto-generates from title, but you can manually set it.

---

## 📞 Next Steps

1. **Customize Content Types:** Add fields specific to your needs
2. **Add More Components:** Create reusable content blocks
3. **Set Up Webhooks:** Trigger actions when content is published
4. **Add Search:** Implement full-text search for articles
5. **Analytics:** Track blog post views and engagement

---

## 🎓 Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi REST API Guide](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Cloud Documentation](https://docs.strapi.io/cloud)
- [Strapi Community Forum](https://forum.strapi.io)

---

**Happy Blogging! 🚀**

