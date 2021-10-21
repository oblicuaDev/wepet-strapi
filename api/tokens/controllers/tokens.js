"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async (ctx) => {
    const { email } = ctx.params;
    var chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var token = "";
    for (var i = 0; i < 30; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
    const tokencreated = await strapi.services.tokens.create({ token: token });
    const user = await strapi.services.wepetusers.findOne({ email });
    return strapi.services.wepetusers.update(
      { id: user.id },
      { token: tokencreated.id }
    );
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.services.tokens.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.tokens });
  },
};
