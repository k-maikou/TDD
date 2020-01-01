const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middleWares = jsonServer.defaults();
const port = process.env.A_LI_YUN_APP_PORT || 3000;
const root = __dirname + '/build';

server.use(express.static(root, { maxAge: 86400000 }));
server.use(middleWares);
const reactRouterWhiteList = ['/create', '/edit/:itemId'];
server.get(reactRouterWhiteList, (request, response) => {
  response.sendFile(path.resolve(root, 'index.html'))
})
server.use(router);

server.listen(3000, () => {
  console.log('服务器已启动');
});
