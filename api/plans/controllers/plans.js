"use strict";
const axios = require("axios");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async (ctx) => {
    let entity = await strapi.services.plans.create(ctx.request.body);
    const { data } = await axios.get(
      `https://wepet.co/plattform/s/test/?id=${entity.id}`
    );
    return ctx.send(
      {
        msg: "Plan Created",
        plan: entity,
        resServicePhp: data,
      },
      201
    );
  },
};
