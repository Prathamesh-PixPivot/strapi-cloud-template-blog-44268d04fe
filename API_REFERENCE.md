# 📡 API Reference

Complete API reference for the Strapi Blog CMS.

## Base URL

- **Development:** `http://localhost:1337/api`
- **Production:** `https://your-strapi-domain.com/api`

## Authentication

For public endpoints, no authentication is required (after setting permissions).

For protected endpoints, include the API token in headers:
```
Authorization: Bearer YOUR_API_TOKEN
```

---

## Article Endpoints

### Get All Articles
```http
GET /api/articles
```

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `populate` | string | Relations to populate | `populate=*` or `populate[author][populate]=avatar` |
| `filters` | object | Filter criteria | `filters[featured][$eq]=true` |
| `sort` | string | Sort order | `sort=publishDate:desc` |
| `pagination[page]` | number | Page number | `pagination[page]=1` |
| `pagination[pageSize]` | number | Items per page | `pagination[pageSize]=10` |

**Example Request:**
```bash
GET /api/articles?populate=*&sort=publishDate:desc&pagination[pageSize]=10
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "My Blog Post",
        "slug": "my-blog-post",
        "description": "This is a blog post description",
        "publishDate": "2024-01-15T10:00:00.000Z",
        "readingTime": 5,
        "featured": true,
        "createdAt": "2024-01-15T09:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z",
        "publishedAt": "2024-01-15T10:00:00.000Z",
        "cover": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "cover.jpg",
              "url": "/uploads/cover.jpg"
            }
          }
        },
        "author": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "John Doe",
              "email": "john@example.com"
            }
          }
        },
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Technology",
              "slug": "technology"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### Get Single Article by ID
```http
GET /api/articles/:id
```

**Example:**
```bash
GET /api/articles/1?populate=*
```

---

### Get Featured Articles
```http
GET /api/articles/featured
```

Returns all published articles where `featured = true`.

**Query Parameters:** Same as "Get All Articles"

**Example:**
```bash
GET /api/articles/featured?populate=*&sort=publishDate:desc
```

---

### Get Recent Articles
```http
GET /api/articles/recent
```

Returns the most recent published articles.

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | number | Number of articles | 10 |
| `populate` | string | Relations to populate | - |

**Example:**
```bash
GET /api/articles/recent?limit=5&populate=*
```

---

### Get Articles by Category
```http
GET /api/articles/category/:slug
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Category slug |

**Example:**
```bash
GET /api/articles/category/technology?populate=*
```

**Response:** Same structure as "Get All Articles"

---

### Get Article by Slug
```http
GET /api/articles/slug/:slug
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Article slug |

**Example:**
```bash
GET /api/articles/slug/my-blog-post?populate=*
```

**Response:** Single article object (not array)

---

### Get Related Articles
```http
GET /api/articles/related
```

Returns articles in the same category as the specified article.

**Query Parameters:**
| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `slug` | string | Article slug | Yes |
| `limit` | number | Number of related articles | No (default: 3) |
| `populate` | string | Relations to populate | No |

**Example:**
```bash
GET /api/articles/related?slug=my-blog-post&limit=3&populate=*
```

---

## Category Endpoints

### Get All Categories
```http
GET /api/categories
```

**Query Parameters:**
- `populate` - Populate relations (e.g., `populate=*` or `populate[articles]=*`)

**Example:**
```bash
GET /api/categories?populate=*
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Technology",
        "slug": "technology",
        "description": "Tech-related articles",
        "articles": {
          "data": [...]
        }
      }
    }
  ]
}
```

---

### Get Single Category
```http
GET /api/categories/:id
```

**Example:**
```bash
GET /api/categories/1?populate=*
```

---

## Author Endpoints

### Get All Authors
```http
GET /api/authors
```

**Query Parameters:**
- `populate` - Populate relations (e.g., `populate=*` or `populate[articles]=*`)

**Example:**
```bash
GET /api/authors?populate=*
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": {
          "data": {
            "id": 1,
            "attributes": {
              "url": "/uploads/avatar.jpg"
            }
          }
        },
        "articles": {
          "data": [...]
        }
      }
    }
  ]
}
```

---

### Get Single Author
```http
GET /api/authors/:id
```

**Example:**
```bash
GET /api/authors/1?populate=*
```

---

## Filter Operators

Strapi supports various filter operators:

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equals | `filters[title][$eq]=My Post` |
| `$ne` | Not equals | `filters[title][$ne]=My Post` |
| `$lt` | Less than | `filters[readingTime][$lt]=10` |
| `$lte` | Less than or equal | `filters[readingTime][$lte]=10` |
| `$gt` | Greater than | `filters[readingTime][$gt]=5` |
| `$gte` | Greater than or equal | `filters[readingTime][$gte]=5` |
| `$in` | In array | `filters[id][$in][0]=1&filters[id][$in][1]=2` |
| `$notIn` | Not in array | `filters[id][$notIn][0]=1` |
| `$contains` | Contains (case-sensitive) | `filters[title][$contains]=Blog` |
| `$notContains` | Does not contain | `filters[title][$notContains]=Draft` |
| `$null` | Is null | `filters[publishDate][$null]=true` |
| `$notNull` | Is not null | `filters[publishDate][$notNull]=true` |
| `$between` | Between values | `filters[readingTime][$between][0]=5&filters[readingTime][$between][1]=10` |

**Complex Filter Example:**
```bash
GET /api/articles?filters[featured][$eq]=true&filters[readingTime][$gte]=5&filters[publishDate][$notNull]=true
```

---

## Sorting

Sort by single field:
```bash
sort=field:asc    # Ascending
sort=field:desc   # Descending
```

Sort by multiple fields:
```bash
sort[0]=publishDate:desc&sort[1]=title:asc
```

---

## Pagination

Default pagination:
- Page size: 25 (configurable in `config/api.js`)
- Max page size: 100

**Example:**
```bash
pagination[page]=1&pagination[pageSize]=10
```

**Response includes pagination metadata:**
```json
{
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "pageCount": 5,
      "total": 50
    }
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "status": 400,
    "message": "Bad Request"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "status": 404,
    "message": "Not Found"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "status": 500,
    "message": "Internal Server Error"
  }
}
```

---

## Frontend Integration Examples

### JavaScript/Fetch
```javascript
// Fetch all articles
const response = await fetch('https://your-strapi-domain.com/api/articles?populate=*');
const data = await response.json();
const articles = data.data;

// Fetch featured articles
const featuredResponse = await fetch(
  'https://your-strapi-domain.com/api/articles/featured?populate=*'
);
const featuredData = await featuredResponse.json();

// Fetch article by slug
const articleResponse = await fetch(
  `https://your-strapi-domain.com/api/articles/slug/my-blog-post?populate=*`
);
const articleData = await articleResponse.json();
const article = articleData.data;
```

### Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-strapi-domain.com/api',
});

// Fetch all articles
const { data } = await api.get('/articles', {
  params: {
    populate: '*',
    sort: 'publishDate:desc',
    'pagination[pageSize]': 10,
  },
});

// Fetch featured articles
const { data: featured } = await api.get('/articles/featured', {
  params: { populate: '*' },
});
```

### Next.js (Server-Side)
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
    revalidate: 60, // ISR: revalidate every 60 seconds
  };
}
```

---

## Image URL Handling

Strapi returns relative URLs for media. Convert to absolute URLs:

```javascript
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

const getImageUrl = (image) => {
  if (!image?.data?.attributes?.url) return null;
  
  const url = image.data.attributes.url;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
};

// Usage
const coverUrl = getImageUrl(article.attributes.cover);
```

---

## Rate Limiting

Strapi doesn't include rate limiting by default. For production, consider:
- Using a reverse proxy (Nginx) with rate limiting
- Implementing rate limiting middleware
- Using a CDN with rate limiting features

---

## Best Practices

1. **Always populate relations** you need to avoid multiple API calls
2. **Use pagination** for large datasets
3. **Cache responses** on the frontend when possible
4. **Handle errors gracefully** with try-catch blocks
5. **Use slugs** for SEO-friendly URLs instead of IDs
6. **Filter published content** using `filters[publishedAt][$notNull]=true`
7. **Optimize images** - Strapi can serve different image formats/sizes

---

For more information, see the [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest).

