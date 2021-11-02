const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async getplanquantity(ctx) {
    const { planId } = ctx.params;
    let entities = await strapi.services.services.find();
    let response = [];
    entities.map((entity) => {
      let found = entity.plan_quantity.find(
        (element) => element.plan.id == planId
      );
      console.log(found);
      response.push({
        service: entity.id,
        quantity: found.quantity,
        available: found.available,
      });
    });
    return response;
  },
};
