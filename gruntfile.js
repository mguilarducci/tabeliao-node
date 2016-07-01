var loadGruntTasks = require('load-grunt-tasks');
var files = ['gruntfile.js'];

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

  grunt.registerTask('test', ['eslint', 'mochaTest']);
};
