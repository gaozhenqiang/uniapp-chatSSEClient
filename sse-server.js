const http = require('http');

// 处理 OPTIONS 请求
function handleOptions(req, res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': 86400, // 24 hours
  });
  res.end();
}

// SSE 连接的处理函数
function handleSSE(req, res) {
  // 设置响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*', // 允许跨域请求
  });

  // 定义一个计数器
  let counter = 0;

  const intervalId = setInterval(() => {
    counter++;
    // 发送事件数据
    res.write("event: connecttime\n")
    res.write(`data: message${counter}\n`)
    res.write(`id: ${counter}\n\n`)

    // 如果计数器超过10，停止发送
    if (counter >= 10) {
      clearInterval(intervalId);
      res.end();
    }
  }, 500);

  // 监听连接关闭事件
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
}

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    handleOptions(req, res);
  } else if (req.url === '/sse') {
    handleSSE(req, res);
  } else {
    res.writeHead(404, {
      'Access-Control-Allow-Origin': '*', // 允许跨域请求
    });
    res.end();
  }
});

// 启动服务器
const port = 3000;
server.listen(port, () => {
  console.log(`http://127.0.0.1:${port}/sse`);
});