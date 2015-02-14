module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task.
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean','concat', 'copy:images', 'cssmin']);

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
