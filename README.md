# 🚀 Strapi Blog CMS - Professional Setup

A professionally configured Strapi headless CMS for managing blog content for your product website.

## 📖 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes! ⚡
- **[Blog Setup Guide](./BLOG_SETUP_GUIDE.md)** - Complete guide to understanding and using your blog CMS
- **[API Reference](./API_REFERENCE.md)** - Complete API endpoint documentation
- **[Configuration Guide](./CONFIGURATION_GUIDE.md)** - Environment variables and configuration

## 🚀 Quick Start

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```bash
npm run build
npm run deploy
# or
yarn strapi deploy
```

**Before deploying:**
1. Read the [Configuration Guide](./CONFIGURATION_GUIDE.md) to set up environment variables
2. Configure your database (PostgreSQL recommended for production)
3. Set up CORS for your frontend domain
4. Generate secure keys for production

## 🎯 Features

- ✅ **Enhanced Article Schema** - SEO fields, publish dates, reading time, featured flag
- ✅ **Custom API Endpoints** - Featured articles, recent posts, category filtering, related articles
- ✅ **SEO Component** - Comprehensive SEO metadata support
- ✅ **CORS Configured** - Ready for frontend integration
- ✅ **Professional Structure** - Well-organized content types and components

## 📝 Content Types

- **Article** - Blog posts with rich content blocks
- **Category** - Organize articles into categories
- **Author** - Author profiles with avatars
- **About** - Static about page content
- **Global** - Global settings and content

## 🔌 API Endpoints

### Standard Endpoints
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `GET /api/categories` - Get all categories
- `GET /api/authors` - Get all authors

### Custom Endpoints
- `GET /api/articles/featured` - Get featured articles
- `GET /api/articles/recent?limit=10` - Get recent articles
- `GET /api/articles/category/:slug` - Get articles by category
- `GET /api/articles/slug/:slug` - Get article by slug
- `GET /api/articles/related?slug=article-slug` - Get related articles

See [API Reference](./API_REFERENCE.md) for complete documentation.

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
