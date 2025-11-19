'use strict';

/**
 *  article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  /**
   * Get featured articles
   */
  async findFeatured(ctx) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findPage('api::article.article', {
      ...query,
      filters: {
        ...query.filters,
        featured: true,
        publishedAt: { $notNull: true },
      },
      populate: {
        cover: true,
        author: {
          populate: {
            avatar: true,
          },
        },
        category: true,
      },
      sort: { publishDate: 'desc' },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  /**
   * Get recent articles
   */
  async findRecent(ctx) {
    const { query } = ctx;
    const limit = query.limit || 10;
    
    const entity = await strapi.entityService.findPage('api::article.article', {
      ...query,
      filters: {
        ...query.filters,
        publishedAt: { $notNull: true },
      },
      populate: {
        cover: true,
        author: {
          populate: {
            avatar: true,
          },
        },
        category: true,
      },
      sort: { publishDate: 'desc' },
      pagination: {
        ...query.pagination,
        pageSize: limit,
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  /**
   * Get articles by category
   */
  async findByCategory(ctx) {
    const { query, params } = ctx;
    const categorySlug = params.slug || query.category;
    
    if (!categorySlug) {
      return ctx.badRequest('Category slug is required');
    }

    // Find category by slug
    const category = await strapi.entityService.findMany('api::category.category', {
      filters: { slug: categorySlug },
    });

    if (!category || category.length === 0) {
      return ctx.notFound('Category not found');
    }

    const entity = await strapi.entityService.findPage('api::article.article', {
      ...query,
      filters: {
        ...query.filters,
        category: category[0].id,
        publishedAt: { $notNull: true },
      },
      populate: {
        cover: true,
        author: {
          populate: {
            avatar: true,
          },
        },
        category: true,
      },
      sort: { publishDate: 'desc' },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  /**
   * Get article by slug
   */
  async findBySlug(ctx) {
    const { params } = ctx;
    const { slug } = params;

    const entity = await strapi.entityService.findMany('api::article.article', {
      filters: { slug, publishedAt: { $notNull: true } },
      populate: {
        cover: true,
        author: {
          populate: {
            avatar: true,
          },
        },
        category: true,
        seo: {
          populate: {
            shareImage: true,
          },
        },
      },
      limit: 1,
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('Article not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity[0], ctx);
    return this.transformResponse(sanitizedEntity);
  },

  /**
   * Get related articles (by category, excluding current article)
   */
  async findRelated(ctx) {
    const { query, params } = ctx;
    const { slug, limit = 3 } = query;
    
    if (!slug) {
      return ctx.badRequest('Article slug is required');
    }

    // Get current article
    const currentArticle = await strapi.entityService.findMany('api::article.article', {
      filters: { slug, publishedAt: { $notNull: true } },
      populate: { category: true },
      limit: 1,
    });

    if (!currentArticle || currentArticle.length === 0) {
      return ctx.notFound('Article not found');
    }

    const categoryId = currentArticle[0].category?.id;
    const currentArticleId = currentArticle[0].id;

    const entity = await strapi.entityService.findPage('api::article.article', {
      ...query,
      filters: {
        ...query.filters,
        id: { $ne: currentArticleId },
        category: categoryId || undefined,
        publishedAt: { $notNull: true },
      },
      populate: {
        cover: true,
        author: {
          populate: {
            avatar: true,
          },
        },
        category: true,
      },
      sort: { publishDate: 'desc' },
      pagination: {
        pageSize: limit,
      },
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
