## Relationship between presets, fields, and tags

### Tags:

An `Observation` has a tags property.

```ts
type tags = {
  [k: string]:
    | boolean
    | number
    | string
    | null
    | (boolean | number | string | null)[];
};
```

This is an open ended propery, that allows any key value pair descriptor to be associated with an observation. For example, any notes associated with a observation is simply saved as a tag, with the `key="notes"`

### Presets:

Presets have a set of predefined tags used to categorize an observation. These tags can have as little or as many descriptors, usually defined by how it is used.

In the following example, there are 2 different types of tags, defined by the presets, both describing bridges.

```ts
// This tag simply defines the observation as being a bridge
const tags = {
  name: 'bridge',
};

// this tag defines the observation as an active suspension bridge over a river
const tags = {
  name: 'bridge',
  bridgeType: 'suspension',
  bodyOfWater: 'river',
  isActive: true,
};
```

In CoMapeo each preset represnts one type of observation (defined by the name tag). Preset also includes other meta data associated with an observation.

### Fields:

Fields are also saved to an observation as a tag. The difference is that they are editted by the user at the time of the observation. A `preset` has predefined `keys` and a predefined `values`, while a `tag` has predefined `keys` and user editted values. This is useful when there are descriptors that cannot be predetermined.

Using the bridge example:

```ts
const tags = {
  // this is predefined by the preset
  type: 'bridge',
  // this is a field, where the user was prompted to input the length
  lengthInMeter: 35,
};
```

### How to determine the fields associated with a preset

`Presets` have a `fieldsId` property of type `string[]`. For each value in the array, there is an associated field with a matching docId.

Each observation can have a several fields associated with it.

Each field has a `type`, where `type: "text" | "number" | "selectOne" | "selectMultiple" | "UNRECOGNIZED";`. This defines how the field is presented to the user,and how the user inputs the value of the field. If the type is `text` or `number` the user inputs a string or number. If the type is `selectOne` or `selectMultiple` the user types is given a list of options to select from which determines the value of the field

A field has a `tagKey` property. This defined the `key` of the tag saved in the observation

### Flow for saving an observation

1. User choses a preset. This preset has `tags` and `fieldIds`.
2. Based on the `fieldIds` the user is prompted to fill in several forms. This provides an another `tags` object where the `keys=Field['tagKeys']` and the value is the value inputted by the user.
3. The tags from the preset, and the tags from the fields are flattened into `tags` object of an observation.
