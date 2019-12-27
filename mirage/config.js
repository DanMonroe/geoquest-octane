export default function() {
  this.namespace = 'api';
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.4.x/shorthands/
  */

  // this.passthrough('/api/sounds/cannon1.mp3');
  // this.passthrough('/api/sounds');
  // this.passthrough('/sounds');
  // this.passthrough('/sounds/*');
  // this.passthrough();
  this.get('/sounds', (schema, request) => {
    // console.log('mirage sound get', request);
    return null;
  });

  this.get('/weapons', (schema/*, request*/) => {
    // console.log('getting weapons');
    return schema.weapons.all();
  });
  this.get('/weapons/:id', (schema, request) => {
    let id = request.params.id;

    return schema.weapons.find(id);
  });

  this.get('/transports', (schema/*, request*/) => {
    // console.log('getting transports');
    return schema.transports.all();
  });
  this.get('/transports/:id', (schema, request) => {
    let id = request.params.id;

    return schema.transports.find(id);
  });

  this.get('/enemies', (schema/*, request*/) => {
    // console.log('getting enemies');
    return schema.enemies.all();
  });
  this.get('/enemies/:id', (schema, request) => {
    let id = request.params.id;

    return schema.enemies.find(id);
  });

  this.get('/tiles', (schema/*, request*/) => {
    // console.log('getting tiles');
    return schema.tiles.all();
  });
  this.get('/tiles/:id', (schema, request) => {
    let id = request.params.id;

    return schema.tiles.find(id);
  });

  this.get('/hexes', (schema/*, request*/) => {
    // console.log('getting hexes');
    return schema.hexes.all();
  });
  this.get('/hexes/:id', (schema, request) => {
    let id = request.params.id;

    return schema.hexes.find(id);
  });

  this.patch('/hexes/:id', function(schema, request) {
    // let attrs = this.normalizedRequestAttrs('hex');
    // console.log(attrs);
    console.log(request);
    console.log(schema);
    debugger;
  });

  this.get('/hex-rows', (schema/*, request*/) => {
    // console.log('getting hex-rows');
    return schema.hexRows.all();
  });
  this.get('/hex-rows/:id', (schema, request) => {
    let id = request.params.id;

    return schema.hexRows.find(id);
  });

  this.get('/maps', (schema/*, request*/) => {
    // console.log('getting maps');
    return schema.maps.all();
  });
  this.get('/maps/:id', (schema, request) => {
    let id = request.params.id;

    return schema.maps.find(id);
  });

  this.get('/players/:id', (schema, request) => {
    let id = request.params.id;

    return schema.players.find(id);
  });

  this.passthrough();
}
