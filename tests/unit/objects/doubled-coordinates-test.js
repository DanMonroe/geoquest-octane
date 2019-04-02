import { module, test } from 'qunit';
import { DoubledCoordinates } from 'geoquest-octane/objects/doubled-coordinates';
import { Hex } from 'geoquest-octane/objects/hex';

module('Unit | Object | doubled-coordinates', function() {

  test('testDoubledRoundtrip', function(assert) {
      let a = new Hex({q:3, r:4, s:-7});
      let b = new DoubledCoordinates({col:1, row:-3});
      equalHex(assert, "conversion_roundtrip doubled-q", a, DoubledCoordinates.qdoubledFromCube(a).qdoubledToCube());
      equalDoubledCoordinates(assert,"conversion_roundtrip doubled-q", b, DoubledCoordinates.qdoubledFromCube(b.qdoubledToCube()));
      equalHex(assert,"conversion_roundtrip doubled-r", a, DoubledCoordinates.rdoubledFromCube(a).rdoubledToCube());
      equalDoubledCoordinates(assert,"conversion_roundtrip doubled-r", b, DoubledCoordinates.rdoubledFromCube(b.rdoubledToCube()));
  });

  test('testDoubledFromCube', function(assert) {
      equalDoubledCoordinates(assert, "doubled_from_cube doubled-q", new DoubledCoordinates({col:1, row:5}), DoubledCoordinates.qdoubledFromCube(new Hex({q:1, r:2, s:-3})));
      equalDoubledCoordinates(assert, "doubled_from_cube doubled-r", new DoubledCoordinates({col:4, row:2}), DoubledCoordinates.rdoubledFromCube(new Hex({q:1, r:2, s:-3})));
  });

  test('testDoubledToCube', function(assert) {
    equalHex(assert,"doubled_to_cube doubled-q", new Hex({q:1, r:2, s:-3}), new DoubledCoordinates({col:1, row:5}).qdoubledToCube());
    equalHex(assert,"doubled_to_cube doubled-r", new Hex({q:1, r:2, s:-3}), new DoubledCoordinates({col:4, row:2}).rdoubledToCube());
  });


  function equalHex(assert, name, a, b) {
    assert.ok((a.q === b.q && a.s === b.s && a.r === b.r), name);
  }
  // function equalOffsetcoord(assert, name, a, b) {
  //   assert.ok((a.col === b.col && a.row === b.row), name);
  // }
  function equalDoubledCoordinates(assert, name, a, b) {
    assert.ok((a.col === b.col && a.row === b.row), name);
  }
  // function equalInt(assert, name, a, b) {
  //   assert.ok((a === b), name);
  // }
  // function equalHexArray(assert, name, a, b) {
  //   assert.equal(a.length, b.length, name);
  //   for (var i = 0; i < a.length; i++) {
  //     this.equalHex(assert, name, a[i], b[i]);
  //   }
  // }

});
