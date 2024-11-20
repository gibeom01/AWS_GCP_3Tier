const http = require('http');
const url = require('url');
const handle = require('./requestHandler').handle; // 요청 핸들러 가져오기

function onRequest(request, response) {
    const parsedUrl = url.parse(request.url, true); // 요청 URL 파싱
    const pathname = parsedUrl.pathname;  // URL의 경로 추출

    // 요청 URL에 맞는 핸들러가 있으면 실행
    if (handle[pathname]) {
        handle[pathname](response); // 해당 경로에 대한 핸들러 실행
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('<h1>404 Not Found</h1>'); // 404 에러 페이지
    }
}

http.createServer(onRequest).listen(8080, () => {
    console.log('Server running at http://10.10.20.46:8080');  // 서버 실행 로그
});
