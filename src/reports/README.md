## Vote API

### POST /vote

This endpoint is used to cast a vote.

#### Request Body

`application/json`

##### Schema

* `vote` - `string`; currently restricted to either "a" or "b"

##### Example

```
{
  "vote": "a"
}
```

### GET /results

This endpoint is used to query the voting results.

#### Response

`application/json`

* `success` - `boolean`

* `result` - `object`; present only if success. The object has a property named for each vote ("a", "b"); the value of the property is a `number` corresponding to the number of votes cast.

* `reason` - `string`; present only if success is false.

#### Example:

```
{
  "success": true,
  "result": {
    "a": 5,
    "b": 3
  }
}
```
