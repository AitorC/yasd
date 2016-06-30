module.exports = function(grunt) {

    grunt.file.expand({}, 'tasks/**.js').forEach(function(configFile) {
        console.log(configFile);
        grunt.config.merge(require('./' + configFile)(grunt));
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-exec');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('test', ['exec:test']);

};
