# Typings

```js
type Response = {
  url: string,
  order: number,
  payload: any,
  delay: number
};

type Fixture = {
  id: string,
  responses: Array<Response>
};
```

# How to convert a har file to a list of responses

```js
declare function getResponsesFromHAR(har: Object, apiRoot?: string): Array<Response>;
```

**Note**. `apiRoot`, if specified, must not end with `/`.

# Create a generic response player

```js
type GenericServer = {
  get(url: string): Promise<any>,
  getErrors(id?: string): Array<string>
};

declare function createGenericResponsePlayer(responses: Array<Response>, delay?: number): GenericServer;
```

# Create a generic server

```js
type Server = {
  getId(): string,
  setId(id: string): void,
  get(url: string): Promise<any>,
  getErrors(id?: string): Array<string>
};

declare function createGenericServer(fixtures: Array<Fixture>, delay?: number): Server;
```

# Create a mock express server

```js
declare function createExpressServer(fixtures: Array<Fixture>, delay?: number);
```

## Endpoints

```
GET /__fixtures__
```

Return the list of fixtures

```
GET /__id__
```

Returns the current test id.

```
POST /__id__/:id
```

Changes the current test id.

```
GET /__errors__/:id?
```

Returns a list of errors for the specified test (or the current test if not specified).

```
GET /*
```

Mocked endpoints.