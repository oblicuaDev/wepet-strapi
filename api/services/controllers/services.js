const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async getplanquantity(ctx) {
    const { planId } = ctx.params;
    let entities = await strapi.services.services.find();
    let response = [];
    entities.map((entity) => {
      response.push({
        id: entity.id,
        name: entity.name,
        image: entity.image,
        plan_quantity: entity.plan_quantity.find(
          (element) => element.plan.id == planId
        ),
      });
    });
    return response;
  },
};
