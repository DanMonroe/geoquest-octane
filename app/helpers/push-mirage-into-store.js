import { getContext } from '@ember/test-helpers';
import { run } from '@ember/runloop';

export default function() {
  let context = getContext();
  let store = context.owner.lookup('service:store');

  Object.keys(context.server.schema)
    .filter(key => context.server.schema[key].all !== undefined) // Get the resources
    .forEach(resource => {
      let models = context.server.schema[resource].all();
      let modelName = models.modelName;
      let serializer = context.server.serializerOrRegistry.serializerFor(modelName);

      let originalAlwaysIncludeLinkageData = serializer.alwaysIncludeLinkageData;
      serializer.alwaysIncludeLinkageData = true;

      let json = serializer.serialize(models);

      serializer.alwaysIncludeLinkageData = originalAlwaysIncludeLinkageData;

      run(() => {
        store.pushPayload(json);
      });
      // run(() => {
      //   let jsonObj = {};
      //   jsonObj[`${modelName}`] = json;
      //   store.pushPayload(jsonObj);
      //
      //   // console.log('pushPayload', jsonObj);
      //
      //   // store.pushPayload(json);
      // });
    });
}
