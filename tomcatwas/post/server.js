const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

function onRequest(request, response) {
    const parsedUrl = url.parse(request.url, true);
    let pathname = parsedUrl.pathname;

    // 루트 경로일 경우 index.html로 리다이렉트
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(__dirname, pathname);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 파일을 찾을 수 없는 경우
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end('<h1>404 Not Found</h1>');
            } else {
                // 서버 오류
                response.writeHead(500);
                response.end(`Server Error: ${err.code}`);
            }
        } else {
            // 성공적으로 파일을 읽은 경우
            const ext = path.extname(filePath);
            let contentType = 'text/html';

            switch (ext) {
                case '.js':
                    contentType = 'text/javascript';
                    break;
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.json':
                    contentType = 'application/json';
                    break;
                case '.png':
                    contentType = 'image/png';
                    break;
                case '.jpg':
                    contentType = 'image/jpg';
                    break;
            }

            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

http.createServer(onRequest).listen(8080, () => {
    console.log('Server running at http://3.36.52.172:8080');
});
