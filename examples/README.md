# 📝 API Examples

Examples for creating and managing blog posts via the Strapi API.

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install axios form-data
   ```

2. **Set environment variables:**
   ```bash
   export STRAPI_URL="http://localhost:1337"
   export STRAPI_API_TOKEN="your_api_token_here"
   ```

   Or create a `.env` file:
   ```env
   STRAPI_URL=http://localhost:1337
   STRAPI_API_TOKEN=your_api_token_here
   ```

3. **Get your API token:**
   - Go to Strapi Admin Panel → Settings → API Tokens
   - Create a new token with "Full access" or custom permissions
   - Copy the token

## Examples

### Basic Example

```javascript
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'your_token_here';

async function createSimplePost() {
  const response = await axios.post(
    `${STRAPI_URL}/api/articles`,
    {
      data: {
        title: 'My Blog Post',
        description: 'A simple blog post',
        author: 1,
        category: 1,
      },
    },
    {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('Created:', response.data);
}

createSimplePost();
```

### Complete Example

See `create-blog-post.js` for a complete example with:
- Image uploads
- Content blocks
- SEO fields
- Relations (author, category)
- Publishing

**Run it:**
```bash
node examples/create-blog-post.js
```

## More Examples

See [API Write Guide](../API_WRITE_GUIDE.md) for:
- JavaScript/Fetch examples
- Axios examples
- Node.js examples
- Python examples
- Complete workflow examples

