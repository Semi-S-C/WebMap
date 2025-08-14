const http = require('http');
const path = require('path');
const MBTiles = require('@mapbox/mbtiles');  // 使用 @mapbox/mbtiles

const mbtilesFile = path.join(__dirname, 'path/to/your/file.mbtiles');  // 替换为你的 mbtiles 文件路径

new MBTiles(mbtilesFile, function(err, mbtiles) {
    if (err) {
        console.error('Error loading MBTiles file:', err);
        return;
    }

    http.createServer(function(req, res) {
        const match = req.url.match(/\/(\d+)\/(\d+)\/(\d+)\.png/);  // 匹配瓦片请求 URL
        if (match) {
            const z = parseInt(match[1], 10);  // 缩放级别
            const x = parseInt(match[2], 10);  // x 坐标
            const y = parseInt(match[3], 10);  // y 坐标

            mbtiles.getTile(z, x, y, function(err, tile, headers) {
                if (err || !tile) {
                    res.statusCode = 404;  // 如果没有瓦片，返回 404
                    res.end();
                } else {
                    res.setHeader('Content-Type', 'image/png');  // 设置响应头为 PNG 图片
                    res.end(tile);
                }
            });
        } else {
            res.statusCode = 404;  // 如果 URL 不匹配，返回 404
            res.end();
        }
    }).listen(8080, () => {
        console.log('Tile server running on http://localhost:8080');
    });
});
