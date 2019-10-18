# developing Web Assembly with Rust 

## 1. Install

```shell
# Install Rust wasm-pack
$ cargo install wasm-pack

# Install Node.js v10.x

# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y nodejs
```

## 2. Add a user to npm
```shell
$ npm adduser
Username: huntersun2018
Password: 
Email: (this IS public) HunterSun2018@gmail.com
Logged in as huntersun2018 on https://registry.npmjs.org/.
```

## 3. Create a new Cargo project
```shell
$ cargo new --lib hello-wasm
```

## 4. Source code

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}
```

## 5. Cargo.toml

```rust
[package]
name = "hello-wasm"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]
description = "A sample project with wasm-pack"
license = "MIT/Apache-2.0"
repository = "https://github.com/yourgithubusername/hello-wasm"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

##5. Build

   ```shell
$ wasm-pack build --scope huntersun2018
   ```

## 6.publish hello-wasm to  npm

```
$ cd pkg
$ npm publish --access=public
```

## 7. use hello-wasm in our Web site

Let's move back out of the `pkg` directory, and make a new directory, `site`, to try this out in:

```
$ cd ../..
$ mkdir site
$ cd site
```

Create a new file, `package.json`, and put the following code in it:

```json
{
    "scripts": {
        "server": "webpack-dev-server",
        "compile": "webpack"
    },
    "dependencies": {
        "@huntersun2018/hello-wasm": "^0.1.0"
    },
    "devDependencies": {
        "webpack": "^4.41.2",
        "webpack-cli": "^3.1.2",
        "webpack-dev-server": "^3.1.10"
    }
}
```

Note that you'll need to fill in your own username, after the `@`, in the dependencies section.

Next, we need to configure Webpack. Create `webpack.config.js` and put the following in it:

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: "development"
};
```

Now we need an HTML file; create an `index.html` and give it the following contents:

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>hello-wasm example</title>
</head>

<body>
    <script src="dist/bundle.js"></script>
</body>

</html>
```

Finally, create the 'src/index.js` referenced in the HTML file and give it these contents:

```javascript
const js = import("../node_modules/@huntersun2018/hello-wasm/hello_wasm.js");
js.then(js => {
  js.greet("WebAssembly");
});
```

Note that you need to fill in your npm username again.

This imports our module from the `node_modules` folder. This isn't considered a best practice, but this is a demo, so we'll work with it for now. Once it's loaded, it calls the `greet` function from that module, passing `"WebAssembly"` as a string. Note how there's nothing special here, yet we're calling into Rust code! As far as the JavaScript code can tell, this is just a normal module.

We're done making files! Let's give this a shot:

```
$ npm install
$ npm run compile
$ npm run server
```

This will start up a web server. Load up [http://localhost:8080](http://localhost:8080/) and you should see an alert box come on the screen, with `Hello, WebAssembly!` in it! We've successfully called from JavaScript into Rust, and from Rust into JavaScript.