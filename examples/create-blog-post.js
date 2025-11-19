/**
 * Example: Creating a Well-Structured Blog Post via Strapi API
 * 
 * This example shows how to create a complete blog post with all fields,
 * including content blocks, SEO, images, and relations.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN; // Set this in your .env file

/**
 * Upload an image file to Strapi
 */
async function uploadImage(filePath) {
    const FormData = require('form-data');
    const fs = require('fs');
    const axios = require('axios');

    const formData = new FormData();
    formData.append('files', fs.createReadStream(filePath));

    const response = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            ...formData.getHeaders(),
        },
    });

    return response.data[0]; // Returns media object with id
}

/**
 * Get author ID by email
 */
async function getAuthorId(email) {
    const axios = require('axios');

    const response = await axios.get(`${STRAPI_URL}/api/authors`, {
        params: {
            'filters[email][$eq]': email,
        },
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
        },
    });

    if (response.data.data.length === 0) {
        throw new Error(`Author with email ${email} not found`);
    }

    return response.data.data[0].id;
}

/**
 * Get category ID by slug
 */
async function getCategoryId(slug) {
    const axios = require('axios');

    const response = await axios.get(`${STRAPI_URL}/api/categories`, {
        params: {
            'filters[slug][$eq]': slug,
        },
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
        },
    });

    if (response.data.data.length === 0) {
        throw new Error(`Category with slug ${slug} not found`);
    }

    return response.data.data[0].id;
}

/**
 * Create a well-structured blog post
 */
async function createBlogPost(postData) {
    const axios = require('axios');

    // 1. Get author and category IDs
    const authorId = await getAuthorId(postData.authorEmail);
    const categoryId = await getCategoryId(postData.categorySlug);

    // 2. Upload cover image if provided
    let coverId = null;
    if (postData.coverImagePath) {
        const coverMedia = await uploadImage(postData.coverImagePath);
        coverId = coverMedia.id;
    }

    // 3. Upload content images if provided
    const contentImageIds = [];
    if (postData.contentImagePaths) {
        for (const imagePath of postData.contentImagePaths) {
            const media = await uploadImage(imagePath);
            contentImageIds.push(media.id);
        }
    }

    // 4. Build content blocks
    const blocks = [];

    // Introduction paragraph
    if (postData.introduction) {
        blocks.push({
            __component: 'shared.rich-text',
            body: `<p>${postData.introduction}</p>`,
        });
    }

    // Cover image (if uploaded)
    if (coverId) {
        blocks.push({
            __component: 'shared.media',
            file: coverId,
        });
    }

    // Main content sections
    if (postData.contentSections) {
        postData.contentSections.forEach((section, index) => {
            // Add heading if provided
            if (section.heading) {
                blocks.push({
                    __component: 'shared.rich-text',
                    body: `<h2>${section.heading}</h2>`,
                });
            }

            // Add content
            if (section.content) {
                blocks.push({
                    __component: 'shared.rich-text',
                    body: section.content,
                });
            }

            // Add image if available
            if (contentImageIds[index]) {
                blocks.push({
                    __component: 'shared.media',
                    file: contentImageIds[index],
                });
            }

            // Add quote if provided
            if (section.quote) {
                blocks.push({
                    __component: 'shared.quote',
                    body: section.quote.text,
                    author: section.quote.author || '',
                });
            }
        });
    }

    // Conclusion
    if (postData.conclusion) {
        blocks.push({
            __component: 'shared.rich-text',
            body: `<h2>Conclusion</h2><p>${postData.conclusion}</p>`,
        });
    }

    // 5. Create the article
    const articleData = {
        data: {
            title: postData.title,
            description: postData.description,
            author: authorId,
            category: categoryId,
            cover: coverId,
            publishDate: postData.publishDate || new Date().toISOString(),
            readingTime: postData.readingTime || 5,
            featured: postData.featured || false,
            tags: postData.tags || [],
            seo: {
                metaTitle: postData.seo?.metaTitle || postData.title,
                metaDescription: postData.seo?.metaDescription || postData.description,
                keywords: postData.seo?.keywords || postData.tags?.join(', ') || '',
                metaRobots: postData.seo?.metaRobots || 'index, follow',
                canonicalURL: postData.seo?.canonicalURL,
            },
            blocks: blocks,
        },
    };

    const response = await axios.post(
        `${STRAPI_URL}/api/articles`,
        articleData,
        {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
            },
        }
    );

    const article = response.data.data;

    // 6. Publish if requested
    if (postData.publish) {
        await axios.post(
            `${STRAPI_URL}/api/articles/${article.id}/actions/publish`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                },
            }
        );
        console.log('✅ Article published!');
    } else {
        console.log('✅ Article created as draft');
    }

    return article;
}

/**
 * Example usage
 */
async function main() {
    try {
        if (!API_TOKEN) {
            throw new Error('STRAPI_API_TOKEN environment variable is required');
        }

        const newPost = await createBlogPost({
            title: 'Getting Started with Strapi API',
            description: 'Learn how to create blog posts programmatically using the Strapi REST API',
            authorEmail: 'john@example.com', // Must exist in Strapi
            categorySlug: 'technology', // Must exist in Strapi
            coverImagePath: './images/cover.jpg', // Optional
            contentImagePaths: ['./images/image1.jpg', './images/image2.jpg'], // Optional
            introduction: 'In this comprehensive guide, we\'ll explore how to create well-structured blog posts through the Strapi API.',
            contentSections: [
                {
                    heading: 'Understanding the API Structure',
                    content: '<p>The Strapi API follows RESTful principles, making it easy to interact with your content programmatically.</p><p>Each content type has standard CRUD endpoints that you can use to create, read, update, and delete content.</p>',
                },
                {
                    heading: 'Working with Content Blocks',
                    content: '<p>Strapi supports dynamic content blocks that allow you to create rich, flexible content structures.</p>',
                    quote: {
                        text: 'Content blocks make it easy to create engaging blog posts with mixed media types.',
                        author: 'Strapi Team',
                    },
                },
                {
                    heading: 'Best Practices',
                    content: '<p>When creating content via API, always:</p><ul><li>Validate your input data</li><li>Handle errors gracefully</li><li>Use proper authentication</li><li>Test in development first</li></ul>',
                },
            ],
            conclusion: 'Creating blog posts via API opens up endless possibilities for automation and integration.',
            readingTime: 8,
            featured: true,
            tags: ['strapi', 'api', 'tutorial', 'blog'],
            seo: {
                metaTitle: 'Getting Started with Strapi API | Your Company',
                metaDescription: 'Learn how to create blog posts programmatically using the Strapi REST API. Complete guide with examples.',
                keywords: 'strapi, api, blog, cms, headless, tutorial',
                canonicalURL: 'https://yourdomain.com/blog/getting-started-with-strapi-api',
            },
            publish: true, // Set to false to create as draft
        });

        console.log('✅ Blog post created successfully!');
        console.log(`📝 Article ID: ${newPost.id}`);
        console.log(`🔗 Slug: ${newPost.attributes.slug}`);
        console.log(`🌐 View at: ${STRAPI_URL}/api/articles/slug/${newPost.attributes.slug}`);

    } catch (error) {
        console.error('❌ Error creating blog post:', error.response?.data || error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { createBlogPost, uploadImage, getAuthorId, getCategoryId };

