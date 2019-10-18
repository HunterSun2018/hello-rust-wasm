const js = import("../node_modules/@huntersun2018/hello-wasm/hello_wasm.js");
js.then(js => {
    js.greet("WebAssembly");
});