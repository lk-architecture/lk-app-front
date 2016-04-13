import staticServer from "node-static";
import httpServer from "http";

var fileServer = new staticServer.Server("./build");

var assetTypes = [
    ".js",
    ".css",
    ".txt",
    ".ico",
    ".html",
    ".png",
    ".woff",
    ".woff2",
    ".ttf",
    ".svg",
    ".eot"
];

function isStaticResource (url) {
    return assetTypes.reduce((memo, assetType) => {
        return memo || url.indexOf(assetType) !== -1;
    }, false);
}

httpServer.createServer(function (request, response) {
    request.addListener("end", function () {
        if (!isStaticResource(request.url)) {
            request.url = "/";
        }
        fileServer.serve(request, response);
    }).resume();
}).listen(8080);
