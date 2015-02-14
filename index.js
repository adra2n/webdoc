var fs = require('fs');
var md = require('node-markdown').Markdown;
var ejs = require('ejs');
var path = require('path');
var src = path.resolve(__dirname, 'src');
var dest = path.resolve(__dirname, 'build');
var tpl = path.resolve(__dirname, 'template');
var mdReg = /(.+)\.md/;
clean(dest);
var list = buildDir(src);
debugger
fs.writeFileSync(path.resolve(dest, 'index.html'), parseTpl('frame.ejs'), {encoding:'utf-8'})
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
            fs.mkdirSync(path.resolve(dest, relative));//建立build中的对应目录
            result.childs = buildDir(filePath);
        }else{
            if(mdReg.test(filename)){//md文件
                result.name = RegExp.$1;//md标题名
                result.link = path.dirname(relative) + '/' + result.name+'.html';
                var buildPath = path.resolve(dest, result.link);
                var html = md(fs.readFileSync(filePath, {encoding:'utf8'}));
                fs.writeFileSync(buildPath,
                    parseTpl('detail.ejs', {title:result.name,content:html}),
                    {encoding:'utf8'});
            }else{
                fs.writeFileSync(destPath, fs.readFileSync(filePath));
            }
        }
        return result;
    });
};
function parseTpl(file, data){
    var template = fs.readFileSync(path.resolve(tpl, file), {encoding:'utf8'});
    return ejs.render(template, data);
};