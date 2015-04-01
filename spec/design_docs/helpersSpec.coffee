h = require('../../lib/design_docs/helpers')

describe 'mk_objs', () ->
  it 'traverses existing objects to return object at path', () ->
    obj = {a: {b: {c: 'd'}}}
    actual = h.mk_objs(obj, ['a', 'b', 'c'])
    expect(actual).toEqual('d')

  it 'sets the item at path to be val, if the item does not exist', () ->
    obj = {a: {b: {}}}
    val = {}
    h.mk_objs(obj, ['a', 'b', 'c'], val)    
    expect(obj.a.b.c).toBe(val)

  it 'defaults val to be an empty object', () ->
    obj = {a: {b: {}}}
    h.mk_objs(obj, ['a', 'b', 'c'])
    expect(obj.a.b.c).toEqual({})

  it 'creates any missing objects on path', () ->
    obj = {a: {}}
    actual = h.mk_objs(obj, ['a', 'b', 'c'])
    expect(obj).toEqual({a: {b: {c: {}}}})

  it 'returns the created object at path', () ->
    obj = {a: {}}
    actual = h.mk_objs(obj, ['a', 'b', 'c'])
    expect(actual).toBe(obj.a.b.c)

  it 'errors if a traversed item is not an object', () ->
    expect(() ->
      obj = {a: 1}
      actual = h.mk_objs(obj, ['a', 'b', 'c'])
    ).toThrow()

  it 'errors if a traversed item is an array', () ->
    expect(() ->
      obj = {a: []}
      actual = h.mk_objs(obj, ['a', 'b', 'c'])
    ).toThrow()

describe 'remove_in_place', () ->
  it 'removes the value from the container array, if already there', () ->
    actual = ['a', 'b', 'c']
    h.remove_in_place(actual, 'b')
    expect(actual).toEqual(['a', 'c'])

  it 'does nothing if the value is not in the container', () ->
    actual = ['a', 'c']
    h.remove_in_place(actual, 'b')
    expect(actual).toEqual(['a', 'c'])

describe 'insert_in_place', () ->
  it 'adds the value to the container array, if not already there', () ->
    actual = ['a', 'b']
    h.insert_in_place(actual, 'c')
    expect(actual).toEqual(['a', 'b', 'c'])

  it 'does nothing if the value is already there', () ->
    actual = ['a', 'b', 'c']
    h.insert_in_place(actual, 'c')
    expect(actual).toEqual(['a', 'b', 'c'])