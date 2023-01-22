import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();

const sessionOpts = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encodeURI(`email=${process.env.EMAIL}&password=${process.env.PASSWORD}`),
};

fetch(process.env.HTTP_SERVER_URL, sessionOpts)
    .then((res) => {
        if (res.ok) {
            let cookie = res.headers.get('set-cookie').split(';')[0];
            const opts = {
                headers: {
                    'Cookie': cookie,
                }
            };
            const ws = new WebSocket(process.env.SOCKET_SERVER_URL, opts);
            
            ws.on('open', function open() {
                ws.send('we have an open connection');
            });

            ws.on('message', function message(data) {
                let parsedData = JSON.parse(data);
                console.log('received: %o', parsedData);
            });

            ws.on('unexpected-response', function unexpected(req, res) {
                console.log('server response: %o', res);
            });

            ws.on('error', function error (data) {
                console.log('we have an error: %s', data.message);
            });
        } else {
            console.log(res.status, res.statusText);
        }
});

