/*
[task_local]
#机场签到
0 7 * * * , tag=机场签到, enabled=true
机场签到
多账号@隔开
格式：token
==========
青龙变量
==========
export airportCookie=''    //多账号@隔开
举个例子：export airportCookie='token@token'
==========
*/


const request = require('request') ? require('request') :'';
const notify = require('./sendNotify') ? require('./sendNotify') : '';
const airportCookie = process.env.airportCookie ? process.env.airportCookie  : '';

//var airportCookie = '';
//var waitTime = 1000;//单位：ms
//var tokenIds = '';
var msg = "";//记录推送内容
var index = 0;//记录账号顺序

//主函数
async function main() {
    if(request == ''){
        console.log("请安装依赖：request");
        return;
    }
    let ac = airportCookie.split('@');
    console.log("开始运行");
    console.log("共"+ac.length+"个账号");
    //循环开始
    for(var i=0;i < ac.length;i++ ){
        if(ac[i] != '' && ac[i] != 'undefined'){//如果账号为空跳过
            index = i+1;//记录当前第几个账号
            // if(i != 0){
            //     console.log("等待"+waitTime/1000+"秒");
            //     await sleep(waitTime);//延迟运行
            // }
            await sign(ac[i]);//签到
        }
    }
    if(msg.length>0){
        console.log(msg);//打印
        await notify.sendNotify("机场签到",msg);//
    }else{
        console.log("啥推送信息都没干");
    }
}
//签到
// POST https://glados.rocks/api/user/checkin HTTP/1.1
//     Host: glados.rocks
// Connection: keep-alive
// Content-Length: 26
// sec-ch-ua: "Chromium";v="106", "Microsoft Edge";v="106", "Not;A=Brand";v="99"
// DNT: 1
// sec-ch-ua-mobile: ?0
//     Authorization: 2955106794105734180656862944519-1080-1920
// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.52
// Content-Type: application/json;charset=UTF-8
// Accept: application/json, text/plain, */*
// sec-ch-ua-platform: "Windows"
// Origin: https://glados.rocks
// Sec-Fetch-Site: same-origin
// Sec-Fetch-Mode: cors
// Sec-Fetch-Dest: empty
// Accept-Encoding: gzip, deflate, br
// Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6
// Cookie:
//
// {"token":"glados.network"}
async function sign(cookie){
    return new Promise(resolve => {
        try {
            request({
                    // 内置http请求函数
                    "url": "https://glados.rocks/api/user/checkin",//请求链接
                    "method": "post", //请求方法
                    "headers": {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Accept": "application/json, text/plain, */*",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.52",
                        "Cookie": cookie,

                    },
                    "body": '{"token":"glados.network"}'
                },
                function (error, response, body) {
                    console.log(body);
                    //存在请求返回代码
                    let data =JSON.parse(body);
                    console.log("账号"+index+"("+data.code+")"+data.message+"\n")
                    msg += "账号"+index+"("+data.code+")"+data.message+"\n";
                    // switch (data.code){
                    //     case 0:
                    //
                    //         break;
                    //     case 1:
                    //         break;
                    //     default:
                    //         msg += "账号"+index+"("+data.code+")"+data.message+"\n";
                    //         break;
                    // }
                    // if(data.code === 1){
                    //     msg += "账号"+index+"("+body.error_code+")"+body.msg+"\n";
                    // }else{
                    //     msg += "账号"+index+"签到失败\n";
                    // }
                    resolve();
                })
        } catch (error) {
            console.log(error);
            resolve();
        }
    });
}


//睡眠函数
// function sleep(time) {
//     return new Promise(resolve => setTimeout(resolve, time));
//}


main()//运行主函数