var md = require('node-markdown').Markdown;
var path = require('path');
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean','concat', 'copy:images', 'cssmin', 'uglify', 'markdown']);

    grunt.registerMultiTask('markdown', 'Parse md file to html.', function(){
        var tpl = grunt.file.read(this.data.tpl, {encoding:'utf-8'});
        this.files.forEach(function(file){
            var mdSrc = grunt.file.read(file.src[0],{encoding:'utf-8'});
            var data = {
                fragment:md(mdSrc),
                style:path.relative(path.dirname(file.dest), this.data.style)
            };
            grunt.file.write(file.dest.replace(/\.md$/,'.html'),
                grunt.template.process(tpl, {data:data}),
                {encoding:'utf-8'});
        }, this);
    });

    // Project configuration.
    grunt.initConfig({
        distdir: 'build',
        pkg: grunt.file.readJSON('package.json'),
        src: {
            js: ['src/**/*.js']
        },
        clean: ['<%= distdir %>/*'],
        copy: {
            images: {//复制图片
                files: [{ dest: '<%= distdir %>', src : 'images/**', expand: true, cwd:'src'}]
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
                    src:['**/*.md'],
                    dest:'<%= distdir %>/docs'
                }]
            }
        },
        hierarchy:{
            target:{
                files:[
                    {
                        expand:true,
                        cwd:'docs',
                        src:['**'],
                        dest:'<%= distdir %>/docs/hierarchy.json'
                    }
                ]
            }
        },
        watch:{
            all: {
                files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
                tasks:['default','timestamp']
            },
            build: {
                files:['<%= src.js %>', '<%= src.specs %>', '<%= src.lessWatch %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
                tasks:['build','timestamp']
            }
        }
    });

};
