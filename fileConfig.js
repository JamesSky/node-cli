const pageData = require('./pageData.json');
const fs = require('fs');
const path = require('path');

if( pageData.name ){
    // 在配置文件父级的同级创建pageData.name文件
    const basePath = path.resolve(__dirname, `../${pageData.name}`);
    if( fs.existsSync(basePath) === false ){
        fs.mkdir( basePath );
    }
    // 创建pageInfo下的配置内容
    const pageInfo = pageData.pageInfo;
    if( pageInfo && pageInfo.forEach ){
        // 重新改造配置文件
        pageInfo.forEach((item) => {
            item.filePath =  `${basePath}/${item.name}`;
            if( item.child ){
                pageInfo.push({
                    'name': item.child.name,
                    'type': item.child.type,
                    'content': item.child.content,
                    'filePath': `${basePath}/${item.name}/${item.child.name}`
                });
            }
        });
        // 创建文件
        pageInfo.forEach((item) => {
            switch( item.type ){
                case 'dir': 
                    fs.mkdirSync( item.filePath );
                    break;
                case 'file':
                    let fileContent = item.content || '';
                    fs.writeFileSync( item.filePath, fileContent )
                    break;
                default:
                    break;
            }
        });
   
    }
}