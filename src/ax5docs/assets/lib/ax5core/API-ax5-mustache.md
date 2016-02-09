# ax5.mustache

> "ax5.mustache" is a modified version of the in the "https://github.com/janl/mustache.js", some of the syntax.

## ax5.mustache.render
`ax5.mustache.render(tmpl, view)`

```js
var view = {
  title: "Joe",
  calc: function () {
    return 2 + 4;
  }
};

var output = ax5.mustache.render("{{title}} spends {{calc}}", view);
```
Please refer to the `mustache` API is about the template.
this version added only a few of the key and function in the `mustache`.
[Mustache API](https://github.com/janl/mustache.js/blob/master/README.md)
You can use all of the API of `mustache` in the same way. I will introduce the features added in the `ax5.mustache` below.


## Array

View:
```js
{
  "beatles": [
    { "firstName": "John", "lastName": "Lennon" },
    { "firstName": "Paul", "lastName": "McCartney" },
    { "firstName": "George", "lastName": "Harrison" },
    { "firstName": "Ringo", "lastName": "Star" }
  ]
}
```

Template:
```
{{#beatles}}
* {{firstName}} {{lastName}} ({{@i}}) ({{@first}})
{{/beatles}}
```

Output:
```
* John Lennon (0) (true)
* Paul McCartney (1) (false)
* George Harrison (2) (false)
* Ringo Star (3) (false)
```

## Object.@each

View:
```js
{
    "beatles": {
        "John": {"firstName": "John", "lastName": "Lennon"},
        "Paul": {"firstName": "Paul", "lastName": "McCartney"},
        "George": {"firstName": "George", "lastName": "Harrison"},
        "Ringo": {"firstName": "Ringo", "lastName": "Star"}
    }
}
```

Template:
```
{{#beatles}}
    {{#@each}}
    * {{@key}} : {{@value.firstName}} {{@value.lastName}}
    {{/@each}}
{{/beatles}}
```

Output:
```
* John : John Lennon
* Paul : Paul McCartney
* George : George Harrison
* Ringo : Ringo Star
```