"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async (ctx) => {
    if (Array.isArray(ctx.request.body)) {
      return await Promise.all(
        ctx.request.body.map(strapi.services.breeds.create)
      );
    } else {
      return strapi.services.breeds.create(ctx.request.body);
    }
  },
};
