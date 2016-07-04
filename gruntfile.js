var loadGruntTasks = require('load-grunt-tasks');
var files = ['gruntfile.js', 'test/**/*.js', 'lib/**/*.js'];

module.exports = function gruntConfig(grunt) {
  loadGruntTasks(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    eslint: {
      target: files
    },

    mochaTest: {
      src: ['test/**/*-test.js'],
      options: {
        reporter: 'spec',
        timeout: 30000,
        colors: true
      }
    }
  });

  grunt.registerTask('test', function task(src) {
    var path;
    if (src) {
      path = 'test/' + src + '-test.js';
      grunt.config('mochaTest.src', path);
    }
    grunt.task.run(['eslint', 'mochaTest']);
  });
};
