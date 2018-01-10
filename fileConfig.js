const pageData = require('./pageData.json');
const fs = require('fs');
const path = require('path');
const process = require('process');

const userstdin = {
    confirm: false,
    projectName: false
};
process.stdin.setEncoding('utf8');
process.stdout.write(`请确定是否创建普通项目：(y/n)`);
process.stdin.on('readable', () => {
    const stdinRead = process.stdin.read();
    if(typeof stdinRead === 'string'){
        const chunk = stdinRead.replace(/(\r\n)|(\n)/g,'');
        if( !userstdin.confirm ){
            if(chunk === 'y'){
                process.stdout.write(`请输入项目名称（默认为fePage，格式为 name:xxx）：`);
                userstdin.confirm = true;
            } else if (chunk === 'n') {
                process.stdin.write(`\n`); 
                process.stdin.end();
            } else {
                process.stdout.write(`请确定是否创建普通项目：(y/n)`);
                userstdin.confirm = false;
            }
            return;
        };
        
        if( !userstdin.projectName ){
            if( chunk.indexOf('name:') != -1 ){
                new makeDirectory( `${chunk.split('name:')[1]}` );
            } else if( chunk === '' ) {
                new makeDirectory();
            } else {
                process.stdout.write(`请输入项目名称（默认为fePage，格式为 name:xxx）：`);
                userstdin.projectName = false;
            }
        }
    }
});

class makeDirectory{
    constructor( dirName ){
        this.dirName  = dirName || pageData.name;
        this.basePath = path.resolve(__dirname, `../${this.dirName}`);
        this.pageInfo = pageData.pageInfo;
        this.makeFile();
    };

    makeFile(){
        if( pageData.name ){
            if( fs.existsSync( this.basePath ) === false ){
                fs.mkdirSync( this.basePath );
                this.assembleData();
            } else {
                process.stdin.write(`*=========*\n该文件名已存在\n*=========*\n`); 
                process.stdin.end();
            }
        }
    };
    assembleData(){
        if( this.pageInfo && this.pageInfo.forEach ){
            // 重新改造配置文件
            this.pageInfo.forEach((item) => {
                item.filePath =  `${this.basePath}/${item.name}`;
                if( item.child ){
                    this.pageInfo.push({
                        'name': item.child.name,
                        'type': item.child.type,
                        'content': item.child.content,
                        'filePath': `${this.basePath}/${item.name}/${item.child.name}`
                    });
                }
            });
            this.mkEachDir();
        };
    };
    mkEachDir(){
        // 创建文件
        this.pageInfo.forEach((item) => {
            switch( item.type ){
                case 'dir': 
                    fs.mkdirSync( item.filePath );
                    break;
                case 'file':
                    const fileContent = item.content || '';
                    fs.writeFileSync( item.filePath, fileContent )
                    break;
                default:
                    break;
            }
        }); 
        this.endDirectory();
    };
    endDirectory(){
        process.stdin.write(`*=========*\n一个基本的前端结构（名字为：${this.dirName}）创建成功\n*=========*\n`);
        process.stdin.end();
    };
}
