### Flow for saving a field to an observation

Each observation can have a several fields associated with it. According to Mapeo Schema:

> A field defines a form field that will be shown to the user when creating or editing a map entity. Presets define which fields are shown to the user for a particular map entity. The field definition defines whether the field should show as a text box, multiple choice, single-select, etc. It defines what tag-value is set when the field is entered.

- The available `Fields` come from the user chosen `Preset`
  - `Preset` has a `fieldsIds` property. This is an array of `Field's` `docIds`
  - based on this array we can retrieve all the fields with matching `docIds` using [useFieldQueries()](../src/frontend/hooks/server/fields.ts)
- A `Field` is saved to the `tags` property of an `Observation`
  - it is saved in the format of `[key]:value`, where `key === Field['tagId']`
  - `key !== Field['docId']`

```ts
type Field = {
    ...rest
    tagKey:string
    docId:String
}

type Preset = {
    ...rest,
    fieldIds:Array<Field['docId']>
    // What are these tags, and are they related
    tags:Tags
}

type Observation = {
    ...rest,
    tags:{
        ...otherTags,
        // Saves Fields here
        [key:Field['tagKey']]:any
    }
}

```

### Open Question

- [ ] is the `Preset['tags']` related to saving a `Field`?
