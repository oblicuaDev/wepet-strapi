"use strict";
const bcrypt = require("bcryptjs");
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  login: async (ctx) => {
    const { email, password } = ctx.request.body;
    if (password === "") {
      return ctx.send({ message: "Password is required." }, 409);
    } else {
      let entity = await strapi.services.wepetusers.findOne({ email });

      if (entity) {
        let result = await bcrypt.compare(password, entity.password);
        console.log(result);
        if (result) {
          return ctx.send({ response: entity }, 200);
        } else {
          return ctx.send(
            {
              message: "Email or password incorrect",
            },
            409
          );
        }
      } else {
        return ctx.send({ message: "Not Found" }, 400);
      }
    }
  },
  create: async (ctx) => {
    let user = ctx.request.body;
    let userFind = await strapi.services.wepetusers.findOne({
      email: user.email,
    });
    if (userFind) {
      return ctx.send(
        {
          msg: "User already exist",
        },
        409
      );
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      let entity = await strapi.services.wepetusers.create(user);
      return ctx.send(
        {
          msg: "User Created",
          user: {
            name: entity.name,
            email: entity.email,
          },
        },
        201
      );
    }
  },
  userPets: async (ctx) => {
    const { id } = ctx.params;
    let response = await strapi.services.wepetusers.findOne({
      id,
    });

    if (response.pets) {
      if (response.pets.length > 0) {
        return ctx.send({ pets: response.pets }, 200);
      }
    } else {
      return ctx.send(
        {
          message: "User not have pets.",
        },
        400
      );
    }
  },
  resetPassword: async (ctx) => {
    let user = ctx.request.body;
    let userFind = await strapi.services.wepetusers.findOne({
      email: user.email,
    });
    if (userFind) {
      return ctx.send(
        {
          msg: "Email to recover password sent",
        },
        200
      );
    } else {
      return ctx.send(
        {
          msg: "There is no user with this email",
        },
        409
      );
    }
  },
  changePassword: async (ctx) => {
    const { token } = ctx.params;
    let user = ctx.request.body;
    const tokenfound = await strapi.services.tokens.findOne({ token });
    const userFound = await strapi.services.wepetusers.findOne({
      token: tokenfound.id,
    });
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    if (userFound) {
      strapi.services.wepetusers.update({ id: userFound.id }, user);
      let respuesta = {
        msg: "User password change.",
      };
      const tokenDelete = await strapi.services.tokens.delete({ token });
      if (tokenDelete) {
        return ctx.send(respuesta, 200);
      }
    } else {
      let respuesta = {
        msg: "User not found.",
      };
      return ctx.send(respuesta, 400);
    }
  },
  firstRegister: async (ctx) => {
    let user = ctx.request.body;
    console.log(user);
    let entity = await strapi.services.wepetusers.create(user);
    if (entity) {
      return ctx.send(
        {
          msg: "User Created",
          user: entity,
        },
        201
      );
    } else {
      return ctx.send(
        {
          msg: "User not Created",
          user: entity,
        },
        201
      );
    }
  },
  async update(ctx) {
    const { id } = ctx.params;
    let entity;
    let user = ctx.request.body;
    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
    entity = await strapi.services.wepetusers.update({ id }, user);
    return sanitizeEntity(entity, { model: strapi.models.wepetusers });
  },
};
