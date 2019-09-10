'use strict'

const Image = use('App/Models/Image');
const Property = use('App/Models/Property');
const Helpers = use('Helpers');

class ImageController {

    async store({ params, request }) {
        const { id } = params;

        console.log(`[store] Property ID: ${id}`);

        const property = await Property.findOrFail(id);

        const images = request.file('image', {
            types: ['image'],
            size: '2mb'
        });

        await images.moveAll(Helpers.tmpPath('uploads'), file => ({
            name: `${Date.now()}-${file.clientName}`
        }));

        if (!images.movedAll()) {
            return images.error();
        }

        await Promise.all(
            images
                .movedList()
                .map(image => property.images().create({ path: image.fileName }))
        );

    }

    async show ({ params, response }) {
        return response.download(Helpers.tmpPath(`uploads/${params.path}`))
    }

}

module.exports = ImageController
