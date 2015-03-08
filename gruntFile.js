var md = require('node-markdown').Markdown;
var marked = require('marked');
var path = require('path');
var mdReg = /\.md$/;
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['debug']);
    grunt.registerTask('doc', ['markdown', 'hierarchy']);
    grunt.registerTask('debug', ['clean', 'concat', 'copy', 'doc']);
    grunt.registerTask('build', ['clean','concat', 'copy:images', 'cssmin', 'uglify', 'doc']);
    //解析md文件
    grunt.registerMultiTask('markdown', 'Parse md file to html.', function(){
        var mdSrc,data,
            tpl = grunt.file.read(this.data.tpl, {encoding:'utf-8'});
        this.files.forEach(function(file){
            var src = file.src[0];
            if(grunt.file.isDir(src)){
                grunt.file.mkdir(file.dest);
            }else if(mdReg.test(src)){
                mdSrc = grunt.file.read(src,{encoding:'utf-8'});
                data = {
                    fragment:marked(mdSrc),
                    style:path.relative(path.dirname(file.dest), this.data.style)
                };
                grunt.file.write(file.dest.replace(/\.md$/,'.html'),
                    grunt.template.process(tpl, {data:data}),
                    {encoding:'utf-8'});
            }else{
                grunt.file.copy(src, file.dest);
            }

        }, this);
    });
    //生成标题层级文件
    grunt.registerMultiTask('hierarchy', 'Get the hierarchy of docs.',function(){
        var conf = this.data.files[0],
            map = {};
        this.files.forEach(function(file){
            var src = file.src[0],
                parent = path.dirname(src),
                parentData = map[parent],
                ext = path.extname(src),
                data = {
                    name:path.basename(src),
                    path:src,
                    childs:[]
                };
            map[src] = data;
            if(parentData){
                if(data.name=='order.json'){
                    try{
                        parentData.order = grunt.file.readJSON(data.path);
                    }catch(e){
                        console.log('parse order.json failed!');
                    }

                }else{
                    parentData.childs.push(data);
                }
            }
            if(ext=='.html'){
                data.link = src.replace(/^build/, '');
            }

        }, this);
        var list = map[conf.cwd];
        if(list&&list.childs){
            var alist = [list];
            for(var i=0,ii;i<alist.length;i++){
                ii = alist[i];
                if(ii.childs){
                    if(ii.order&&ii.order.length){
                        ii.childs = ii.childs.sort(function(a, b){
                            return ii.order.indexOf(path.basename(a.name, '.html'))-ii.order.indexOf(path.basename(b.name, '.html'));
                        });
                    }
                    Array.prototype.push.apply(alist,ii.childs);
                }
            }
            grunt.file.write(conf.dest, JSON.stringify(list.childs), {encoding:'utf8'});
        }
    });
    //开启server
    grunt.registerTask('server', 'Setup a node server.', function(){
        var http = require('http');
        var express = require('express');
        var app = express();
        var server = http.createServer(app);
        app.use('/', express.static(__dirname + '/build'));

        server.listen(8080, '0.0.0.0', 511, function() {
            // // Once the server is listening we automatically open up a browser
            var open = require('open');
            open('http://localhost:' + 1688 + '/');
        });
    });

    // Project configuration.
    grunt.initConfig({
        distdir: 'build',
        pkg: grunt.file.readJSON('package.json'),
        clean: ['<%= distdir %>/*'],
        copy: {
            images: {//复制图片
                files: [{ dest: '<%= distdir %>', src : 'images/**', expand: true, cwd:'src'}]
            },
            js: {//复制js
                files: [{ dest: '<%= distdir %>', src : 'js/**', expand: true, cwd:'src'}]
            },
            css: {//复制css
                files: [{ dest: '<%= distdir %>', src : 'css/**', expand: true, cwd:'src'}]
            }
        },
        cssmin:{
            target:{
                files:[{
                    expand:true,
                    cwd:'src/css',
                    src:['*.css'],
                    dest:'<%= distdir %>/css'
                }]
            }
        },
        concat:{
            index: {//生成首页
                src: ['src/index.html'],
                dest: '<%= distdir %>/index.html',
                options: {
                    process: true
                }
            }
        },
        uglify:{
            target: {
                files:[
                    {
                        expand:true,
                        cwd:'src/js',
                        src:['*.js'],
                        dest:'<%= distdir %>/js'
                    }
                ]
            }
        },
        markdown:{
            target:{
                tpl:'src/md.html',
                style:'<%= distdir %>/css/markdown.css',
                files:[{
                    expand:true,
                    cwd:'docs',
                    src:['**'],
                    dest:'<%= distdir %>/docs'
                }]
            }
        },
        hierarchy:{
            target:{
                files:[
                    {
                        expand:true,
                        cwd:'<%= distdir %>/docs',
                        src:['**'],
                        dest:'<%= distdir %>/docs/hierarchy.json'
                    }
                ]
            }
        },
        watch:{
            src:{
                files:['src/**','docs/**'],
                tasks:['debug']
            }
        }
    });

};
