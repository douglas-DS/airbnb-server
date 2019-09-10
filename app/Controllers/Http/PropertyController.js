'use strict'

const Property = use ('App/Models/Property');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Show a list of all properties.
   * GET properties
   */
  async index ({ request }) {
    const { latitude, longitude } = request.all();
    console.log(`[index] req latitude: ${latitude}`);
    console.log(`[index] req longitude: ${longitude}`);

    const properties = Property.query()
      .with('images')
      .nearBy(latitude, longitude, 10)
      .fetch();
    
    return properties;
  }
 
  /**
   * Create/save a new property.
   * POST properties
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const { username, id } = auth.user;

    console.log(`[store] User: ${username}`)

    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ]);

    const property = await Property.create({ ...data, user_id: id });

    return property;
  }

  /**
   * Display a single property.
   * GET properties/:id
   *
   * @param {params} ctx.params
   */
  async show ({ params }) {
    const property = await Property.findOrFail(params.id);

    await property.load('images');

    return property;
  }



  /**
   * Update property details.
   * PUT or PATCH properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const { id } = params;

    console.log(`[update] Property id: ${id}`);

    const property = await Property.findOrFail(id);

    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ]);


    property.merge(data);

    await property.save();

    return property;
  }

  /**
   * Delete a property with id.
   * DELETE properties/:id
   *
   * @param {object} ctx
   * @param {Auth} ctx.auth
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    const property = await Property.findOrFail(params.id);

    if (property.user.id != auth.user.id) {
      return response.status(401).send({ error: 'Not authorized' });
    }

    await property.delete();
  }
}

module.exports = PropertyController
