# LUtils
A few very robust utilities.

- **merge** Merges two objects together deeply
- **merge.white** Merge two objects together, but only properties that exist
- **merge.black** Merge two objects together, but only properties that do not exist
- **typeOf** Consistantly gets the type of a value as a string
- **typeOf[type]** Shortcut function which returns a bool
- **clone** *Reliably* deep clones an object or array, recursively


Include all or be selective.
```coffee
{ clone, merge, typeOf } = require 'lutils'

typeOf = require 'lutils/typeOf'
```


#### clone( value, ?depth = 8?, ?types = [ 'object', 'array' ]? )
Clones an object or array as deep as depth.

Values which will still remain as references:
- Functions
- Object's `__proto__` (such as `class` instances)
- Any property after `depth` is reached

To clone a function you should explicitly:
```coffee
fn = oldFn.bind()
# or
fn = -> oldFn.apply this, arguments

merge fn, oldFn # Merge in any own properties of the function
```

#### merge( object1, object2, ?depth = 8?, ?types = [ 'object' ]? )
Merge the second object into the first recursively until depth is reached for each property, replacing object1's values with those in object2.

`types` is an array of types that, when matched on a value, will be iterated over and merged in. This means you can merge a function's properties or an array's properties recursively, thus preserving pointer references to the first object's instance.

```coffee
fn1 = -> return 'fn1' + fn1.prop.b
fn1.prop = { a: 1 }

fn2 = -> return 'fn2' + fn2.prop.a
fn2.prop = { b: 2 }

obj1 = { a: { b: { fn: fn1 } } }
obj2 = { a: { b: { fn: fn2 } } }

merge obj1, obj2
# >> { a: { b: { fn: [Function] } } }

obj1.a.b.fn.prop
# >> { a: 1, b: 2 }

obj1.a.b.fn()
# 'fn1!2'
```

#### merge.white( object1, object2, depth = 8, iterators = [ 'object' ] )
Whitelisted merge.
Merges properties into object1 from object only if the property exists in object1

#### merge.black( object1, object2, depth = 8, iterators = [ 'object' ] )
Blacklisted merge.
Merges properties into object1 from object only if the property *doesnt* exist in object1

#### typeOf( value )
Returns the primitive type of a value as a lowercase string, very reliable.
To be used in combination with `instanceof` and `object.constructor.name` when necessary.

```coffee
typeOf 'a string' # >> 'object'
typeOf { an: { object: null } } # >> 'object'
typeOf null # >> 'null'
typeOf 0 # >> 'number'
```

Also has helper properties which return a boolean.

#### typeOf[type]( value )

```coffee
typeOf.RegExp 'not regex' # false
typeOf.Object null # false
typeOf.Array [] # true

###
Avaliable properties (Also avaliable in lowercase):
	typeOf.Undefined
	typeOf.Boolean
	typeOf.String
	typeOf.Function
	typeOf.Array
	typeOf.Object
	typeOf.Null
	typeOf.Number
	typeOf.Date
	typeOf.RegExp
	typeOf.NaN
###
```
