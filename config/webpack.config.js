module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "index.js",
        library: "hospitalLib",
        libraryTarget: "umd",
        umdNamedDefine: true,
    },
    resolve: {
        extensions: [".ts"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
        ],
    },
};
