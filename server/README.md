# server

To install dependencies:

```bash
yarn install
```

To run:

```bash
yarn dev
```

````
callback_function: (x) => {
    const output = pipe.tokenizer.decode(x[0].output_token_ids, {
        skip_special_tokens: true,
    });

    console.log("output", output);
},
```
````
