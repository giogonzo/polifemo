# Typings

```js
type Response = {
  url: string,
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

# Create a generic player

```js
type Server = {
  getId(): string,
  setId(id: string): void,
  get(url: string): Promise<any>,
  getErrors(id?: string): Array<string>
};

declare function createGenericPlayer(fixtures: Array<Fixture>, delay?: number): Server;
```

# Create an express player app

```js
declare function createExpressPlayer(fixtures: Array<Fixture>, delay?: number);
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

# Config

```js
type TestId = string;
type Test = {
  id: string,
  client: {
    path: string
  },
  server?: {
    file: string
  },
  createdAt?: string,
  description?: string,
  author?: string
};
type Tests = {[key: TestId]: Test};
```