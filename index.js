var fs = require('fs');
var md = require('node-markdown').Markdown;
var path = require('path');
var src = path.resolve(__dirname, 'src');
var dest = path.resolve(__dirname, 'build');
var mdReg = /(.+)\.md/;
clean(dest);
var result = buildDir(src);
/**
 * 递归读取目录中文件
 */
function buildDir(dir){
    var files = fs.readdirSync(dir);
    return files.map(function(filename){
        var filePath = path.resolve(dir, filename),
            stat = fs.statSync(filePath),
            result = {};
        result.name = filename;
        result.path = filePath;
        var relative = path.relative(src, filePath);//相对src目录的路径
        if(stat.isDirectory()){
            result.childs = buildDir(filePath);
            fs.mkdirSync(path.resolve(dest, relative));//建立build中的对应目录
        }else{
            if(mdReg.test(filename)){//md文件
                result.name = RegExp.$1;//md标题名
                var buildPath = path.resolve(dest, path.dirname(relative), result.name+'.html');
                var html = md(fs.readFileSync(filePath, {encoding:'utf8'}));
                fs.writeFileSync(buildPath, html, {encoding:'utf8'});

                result.link = destPath;
            }else{
                fs.writeFileSync(destPath, fs.readFileSync(filePath));
            }
        }
        return result;
    });
};
/**
 * 清除目录中所有文件
 * @param dir
 */
function clean(dir){
    var list = [dir];
    for(var j=0;j<list.length;j++){
        var item = list[j];
        fs.readdirSync(item).forEach(function(filename){
            var filePath = path.resolve(item, filename),
                stat = fs.statSync(filePath);
            if(stat.isDirectory()){
                list.push(filePath);
            }else{
                fs.unlinkSync(filePath);//文件直接删除
            }
        });
    }
    for(var i=list.length-1;i>0;i--){
        fs.rmdirSync(list[i]);
    }
};