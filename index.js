/**
 * 自动路由规则
 */

var path = require('path');
var fs = require('fs');

function getPath(filePath, file) {
    return path.normalize(path.join(filePath, file));
}

function findRouter(routesPath, list) {

    var fileList = fs.readdirSync(routesPath);
    fileList.forEach(function (file) {
        //判断是以 .js 结尾的才是router,否则是目录
        var filePath = getPath(routesPath, file);
        if (/.js$/.test(file)) {
            list.push(filePath);
        } else {
            findRouter(filePath, list);
        }
    });

}

/**
 * 自动路由初始化操作
 * @param app app对象
 * @param routesPath routes的路径
 */
exports.init = function (app, routesPath) {

    var fileList = [];
    findRouter(routesPath, fileList);

    fileList.forEach(function (filePath) {

        var route = require(filePath);

        filePath = filePath.replace(routesPath, '').replace('.js', '').replace(/\\/g, '/');
        if (filePath.indexOf('/index') == 0) {
            filePath = '/';
        }
        app.use(filePath, route);

    })

    app = fileList = null;


}