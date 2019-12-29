module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            options: {configFile: 'eslint.json'},
            files: [
                'Gruntfile.js',
                'src/*.js'
            ]
        },
        browserify: {
            dist: {
                files: {
                    'dist/roundone.js': [
                        'third_party/mugenjs_renderer/src/player.js',
                        'third_party/mugenjs_renderer/src/resource.js',
                        'third_party/mugenjs_renderer/src/app.js',
                        'src/actions.js',
                        'src/character.js',
                        'src/conditions.js',
                        'src/control.js'
                    ]
                }
            },
            options: {
                transform: [
                    ['babelify', {presets: 'es2015'}],
                    ['uglifyify']
                ],
                alias: {
                    'player': './third_party/mugenjs_renderer/src/player.js',
                    'resource': (
                        './third_party/mugenjs_renderer/src/resource.js'
                    ),
                    'app': './third_party/mugenjs_renderer/src/app.js',
                    'actions': './src/actions.js',
                    'character': './src/character.js',
                    'conditions': './src/conditions.js',
                    'control': './src/control.js'
                }
            }
        }
    });

    // Load dependencies.
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-eslint');

    // Default task(s).
    grunt.registerTask('test', ['eslint']);
    grunt.registerTask('default', ['eslint', 'browserify']);
};
