const http = require('http');
const config = require('./config');
const cp = require('child_process');
const path = require('path');

let isStartting = false;

function main () {
    http.get(config.listenerURL, (res)=>{
        const { statusCode } = res;
        if (statusCode !== 200) {
            // 连接不上
            console.log('连接出错.....');
            runExe();
        } else {
            isStartting = false;
            console.log('正常....');
        }
    }).on('error', (e) => {
        // 连接不上
        console.log('请求出错.....');
        runExe();
    });
}

main();
setInterval(()=> {
    main();
}, config.interval);


function runExe() {
    if (!isStartting) {
        isStartting = true;
        let dir = path.dirname(config.exePath);
        let child = cp.execFile(config.exePath, [], {
            cwd: dir
        }, (error)=>{
            if (error) {
                isStartting = false;
            } else {
                main();
            }
        });
        child.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
            isStartting = false;
        });
        child.on('error', (error) => {
            console.log(`Failed to start subprocess ${error}`);
        });
        child.on('close', (code) => {
            console.log(`Child closed with code ${code}`);
            isStartting = false;
        });
    }
}