# ✍️ Creating Blog Posts via API

Complete guide to creating, updating, and managing blog posts through the Strapi API.

## 🔐 Authentication Setup

To create posts via API, you need to authenticate using **API Tokens**.

### Step 1: Create an API Token

1. **Access Admin Panel:**
   - Go to `http://localhost:1337/admin`
   - Log in with your admin account

2. **Create API Token:**
   - Go to **Settings** → **API Tokens**
   - Click **Create new API Token**

3. **Configure Token:**
   - **Name**: "Blog API Token" (or any name)
   - **Token duration**: Choose "Unlimited" or set expiration
   - **Token type**: Select **"Full access"** or **"Custom"**
     - **Full access**: Can create, read, update, delete all content
     - **Custom**: Select specific permissions (recommended for production)
   - **Permissions**: If using Custom, enable:
     - `Article`: `create`, `update`, `delete`, `find`, `findOne`
     - `Category`: `find`, `findOne` (to reference categories)
     - `Author`: `find`, `findOne` (to reference authors)

4. **Save and Copy Token:**
   - Click **Save**
   - **IMPORTANT**: Copy the token immediately (you won't see it again!)
   - Store it securely (environment variable, secret manager, etc.)

### Step 2: Use Token in API Requests

Include the token in the `Authorization` header:

```javascript
Authorization: Bearer YOUR_API_TOKEN
```

---

## 📝 Creating Articles

### Basic Article Creation

**Endpoint:**
```http
POST /api/articles
```

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
```

**Request Body:**
```json
{
  "data": {
    "title": "My First Blog Post",
    "description": "This is a short description of my blog post",
    "author": 1,
    "category": 1,
    "publishDate": "2024-01-15T10:00:00.000Z",
    "readingTime": 5,
    "featured": false
  }
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "description": "This is a short description of my blog post",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "publishedAt": null
    }
  },
  "meta": {}
}
```

**Note:** The article is created as a **draft**. To publish it, either:
- Use the `publish` endpoint (see below)
- Or set `publishedAt` in the request

---

### Complete Article with All Fields

**Request Body:**
```json
{
  "data": {
    "title": "Complete Blog Post Example",
    "description": "This is a comprehensive example showing all available fields for a blog post",
    "author": 1,
    "category": 1,
    "publishDate": "2024-01-15T10:00:00.000Z",
    "readingTime": 8,
    "featured": true,
    "tags": ["technology", "web-development", "strapi"],
    "seo": {
      "metaTitle": "Complete Blog Post Example | Your Company",
      "metaDescription": "Learn about creating comprehensive blog posts with Strapi API",
      "keywords": "strapi, api, blog, cms, headless",
      "metaRobots": "index, follow",
      "canonicalURL": "https://yourdomain.com/blog/complete-blog-post-example"
    },
    "blocks": [
      {
        "__component": "shared.rich-text",
        "body": "<p>This is the introduction paragraph of your blog post. You can use <strong>HTML formatting</strong> here.</p>"
      },
      {
        "__component": "shared.media",
        "file": 1
      },
      {
        "__component": "shared.quote",
        "body": "This is an inspiring quote from your article.",
        "author": "John Doe"
      },
      {
        "__component": "shared.rich-text",
        "body": "<p>More content paragraphs...</p><h2>Subheading</h2><p>Additional content...</p>"
      },
      {
        "__component": "shared.slider",
        "files": [1, 2, 3]
      }
    ]
  }
}
```

---

### Creating Article with Cover Image

**Option 1: Upload Image First, Then Reference**

1. **Upload Image:**
```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer YOUR_API_TOKEN
```

**Form Data:**
```
files: [image file]
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "cover.jpg",
    "url": "/uploads/cover.jpg",
    "mime": "image/jpeg",
    "size": 102400
  }
]
```

2. **Create Article with Cover:**
```json
{
  "data": {
    "title": "Article with Cover",
    "description": "Article description",
    "cover": 1,
    "author": 1,
    "category": 1
  }
}
```

**Option 2: Upload and Create in One Request**

Some setups allow uploading during creation, but typically you upload first.

---

### Publishing Articles

**Option 1: Create as Published**
```json
{
  "data": {
    "title": "Published Article",
    "description": "This will be published immediately",
    "author": 1,
    "category": 1,
    "publishedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Option 2: Publish After Creation**

**Endpoint:**
```http
POST /api/articles/:id/actions/publish
Authorization: Bearer YOUR_API_TOKEN
```

**Example:**
```bash
POST /api/articles/1/actions/publish
```

---

## 🔄 Updating Articles

### Update Entire Article

**Endpoint:**
```http
PUT /api/articles/:id
```

**Request Body:**
```json
{
  "data": {
    "title": "Updated Title",
    "description": "Updated description",
    "featured": true,
    "readingTime": 10
  }
}
```

### Partial Update

**Endpoint:**
```http
PATCH /api/articles/:id
```

**Request Body:**
```json
{
  "data": {
    "featured": true
  }
}
```

---

## 🗑️ Deleting Articles

**Endpoint:**
```http
DELETE /api/articles/:id
```

**Headers:**
```http
Authorization: Bearer YOUR_API_TOKEN
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Deleted Article"
    }
  }
}
```

---

## 📋 Working with Relations

### Finding Author and Category IDs

Before creating an article, you need the IDs of the author and category.

**Get Authors:**
```http
GET /api/authors
```

**Get Categories:**
```http
GET /api/categories
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

Use the `id` field when creating articles.

---

## 🧩 Content Blocks Structure

### Rich Text Block
```json
{
  "__component": "shared.rich-text",
  "body": "<p>Your HTML content here. Supports <strong>bold</strong>, <em>italic</em>, <a href='#'>links</a>, etc.</p>"
}
```

### Media Block
```json
{
  "__component": "shared.media",
  "file": 1  // ID of uploaded media file
}
```

### Quote Block
```json
{
  "__component": "shared.quote",
  "body": "The quote text",
  "author": "Quote author name"
}
```

### Slider Block
```json
{
  "__component": "shared.slider",
  "files": [1, 2, 3]  // Array of media file IDs
}
```

### Complete Blocks Example
```json
{
  "blocks": [
    {
      "__component": "shared.rich-text",
      "body": "<p>Introduction paragraph...</p>"
    },
    {
      "__component": "shared.media",
      "file": 1
    },
    {
      "__component": "shared.rich-text",
      "body": "<h2>Section Title</h2><p>More content...</p>"
    },
    {
      "__component": "shared.quote",
      "body": "This is an important quote",
      "author": "Expert Name"
    },
    {
      "__component": "shared.slider",
      "files": [2, 3, 4]
    }
  ]
}
```

---

## 💻 Code Examples

### JavaScript/Fetch

```javascript
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'your_api_token_here';

// Create article
async function createArticle(articleData) {
  const response = await fetch(`${STRAPI_URL}/api/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      data: articleData,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Example usage
const newArticle = await createArticle({
  title: 'My New Blog Post',
  description: 'This is my blog post description',
  author: 1,
  category: 1,
  publishDate: new Date().toISOString(),
  readingTime: 5,
  featured: false,
  tags: ['technology', 'web'],
  seo: {
    metaTitle: 'My New Blog Post | Company',
    metaDescription: 'Description for SEO',
    keywords: 'blog, technology',
    metaRobots: 'index, follow',
  },
  blocks: [
    {
      __component: 'shared.rich-text',
      body: '<p>This is the content of my blog post.</p>',
    },
  ],
});

console.log('Created article:', newArticle);
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Create article
async function createArticle(articleData) {
  const { data } = await api.post('/articles', {
    data: articleData,
  });
  return data;
}

// Update article
async function updateArticle(id, updates) {
  const { data } = await api.put(`/articles/${id}`, {
    data: updates,
  });
  return data;
}

// Publish article
async function publishArticle(id) {
  const { data } = await api.post(`/articles/${id}/actions/publish`);
  return data;
}

// Delete article
async function deleteArticle(id) {
  const { data } = await api.delete(`/articles/${id}`);
  return data;
}
```

### Node.js Example

```javascript
const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function createBlogPost(postData) {
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/articles`,
      {
        data: {
          title: postData.title,
          description: postData.description,
          author: postData.authorId,
          category: postData.categoryId,
          publishDate: postData.publishDate || new Date().toISOString(),
          readingTime: postData.readingTime || 5,
          featured: postData.featured || false,
          tags: postData.tags || [],
          seo: postData.seo || {},
          blocks: postData.blocks || [],
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Article created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating article:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
createBlogPost({
  title: 'My Blog Post',
  description: 'Description here',
  authorId: 1,
  categoryId: 1,
  tags: ['tech', 'web'],
  blocks: [
    {
      __component: 'shared.rich-text',
      body: '<p>Content here</p>',
    },
  ],
});
```

### Python Example

```python
import requests
import json
from datetime import datetime

STRAPI_URL = "http://localhost:1337"
API_TOKEN = "your_api_token_here"

def create_article(article_data):
    url = f"{STRAPI_URL}/api/articles"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "data": article_data
    }
    
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()

# Example usage
article = create_article({
    "title": "My Python Blog Post",
    "description": "Created via Python",
    "author": 1,
    "category": 1,
    "publishDate": datetime.now().isoformat(),
    "readingTime": 5,
    "featured": False,
    "tags": ["python", "api"],
    "blocks": [
        {
            "__component": "shared.rich-text",
            "body": "<p>Content from Python</p>"
        }
    ]
})

print(f"Created article: {article['data']['id']}")
```

---

## 🔍 Finding IDs for Relations

### Helper Function to Get Author ID by Email

```javascript
async function getAuthorIdByEmail(email) {
  const response = await fetch(
    `${STRAPI_URL}/api/authors?filters[email][$eq]=${email}`
  );
  const data = await response.json();
  return data.data[0]?.id;
}

// Usage
const authorId = await getAuthorIdByEmail('john@example.com');
```

### Helper Function to Get Category ID by Slug

```javascript
async function getCategoryIdBySlug(slug) {
  const response = await fetch(
    `${STRAPI_URL}/api/categories?filters[slug][$eq]=${slug}`
  );
  const data = await response.json();
  return data.data[0]?.id;
}

// Usage
const categoryId = await getCategoryIdBySlug('technology');
```

---

## 📤 Uploading Media Files

### Upload Single Image

```javascript
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data[0].id; // Returns the media ID
}

// Usage
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const mediaId = await uploadImage(file);

// Use mediaId in article creation
await createArticle({
  cover: mediaId,
  // ... other fields
});
```

### Upload Multiple Images

```javascript
async function uploadImages(files) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
    body: formData,
  });

  return await response.json(); // Returns array of media objects
}
```

---

## ✅ Complete Workflow Example

```javascript
// Complete workflow: Upload image, get author/category, create article, publish

async function createCompleteBlogPost(postData) {
  // 1. Upload cover image
  let coverId = null;
  if (postData.coverFile) {
    const coverMedia = await uploadImage(postData.coverFile);
    coverId = coverMedia.id;
  }

  // 2. Get author ID
  const authorResponse = await fetch(
    `${STRAPI_URL}/api/authors?filters[email][$eq]=${postData.authorEmail}`
  );
  const authorData = await authorResponse.json();
  const authorId = authorData.data[0]?.id;

  if (!authorId) {
    throw new Error('Author not found');
  }

  // 3. Get category ID
  const categoryResponse = await fetch(
    `${STRAPI_URL}/api/categories?filters[slug][$eq]=${postData.categorySlug}`
  );
  const categoryData = await categoryResponse.json();
  const categoryId = categoryData.data[0]?.id;

  if (!categoryId) {
    throw new Error('Category not found');
  }

  // 4. Upload content images
  const contentImageIds = [];
  if (postData.contentImages) {
    const uploadedImages = await uploadImages(postData.contentImages);
    contentImageIds.push(...uploadedImages.map(img => img.id));
  }

  // 5. Build blocks with images
  const blocks = [
    {
      __component: 'shared.rich-text',
      body: postData.introduction,
    },
  ];

  if (contentImageIds.length > 0) {
    blocks.push({
      __component: 'shared.media',
      file: contentImageIds[0],
    });
  }

  if (postData.mainContent) {
    blocks.push({
      __component: 'shared.rich-text',
      body: postData.mainContent,
    });
  }

  // 6. Create article
  const article = await createArticle({
    title: postData.title,
    description: postData.description,
    cover: coverId,
    author: authorId,
    category: categoryId,
    publishDate: postData.publishDate || new Date().toISOString(),
    readingTime: postData.readingTime || 5,
    featured: postData.featured || false,
    tags: postData.tags || [],
    seo: {
      metaTitle: postData.seo?.metaTitle || postData.title,
      metaDescription: postData.seo?.metaDescription || postData.description,
      keywords: postData.seo?.keywords || '',
      metaRobots: postData.seo?.metaRobots || 'index, follow',
      canonicalURL: postData.seo?.canonicalURL,
    },
    blocks: blocks,
  });

  // 7. Publish if requested
  if (postData.publish) {
    await publishArticle(article.data.id);
  }

  return article;
}

// Usage
const newPost = await createCompleteBlogPost({
  title: 'My Complete Blog Post',
  description: 'A comprehensive blog post',
  authorEmail: 'john@example.com',
  categorySlug: 'technology',
  coverFile: coverFileObject,
  contentImages: [image1, image2],
  introduction: '<p>Introduction paragraph...</p>',
  mainContent: '<p>Main content...</p>',
  readingTime: 8,
  featured: true,
  tags: ['tech', 'web'],
  seo: {
    metaTitle: 'My Complete Blog Post | Company',
    metaDescription: 'SEO description',
    keywords: 'blog, tech',
  },
  publish: true,
});
```

---

## 🛡️ Security Best Practices

1. **Never expose API tokens in frontend code**
   - Store tokens in environment variables
   - Use server-side API calls for write operations
   - Consider using a backend proxy

2. **Use Custom Token Permissions**
   - Don't use "Full access" in production
   - Grant only necessary permissions
   - Create separate tokens for different purposes

3. **Validate Input**
   - Sanitize HTML content
   - Validate file types and sizes
   - Check required fields

4. **Rate Limiting**
   - Implement rate limiting on your API
   - Monitor API usage
   - Set up alerts for unusual activity

---

## 🐛 Common Issues

### Issue: 403 Forbidden
**Solution:** Check API token permissions and ensure token is valid

### Issue: 400 Bad Request - Relation not found
**Solution:** Verify author and category IDs exist

### Issue: Blocks not saving
**Solution:** Ensure `__component` field is correct and component exists

### Issue: Images not uploading
**Solution:** Check file size limits and file type restrictions

---

## 📚 Next Steps

- Read [API Reference](./API_REFERENCE.md) for all endpoints
- Check [Blog Setup Guide](./BLOG_SETUP_GUIDE.md) for general setup
- Review [Configuration Guide](./CONFIGURATION_GUIDE.md) for production setup

