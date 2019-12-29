module.exports = function(grunt) {
    const MUGEN_RENDERER = 'third_party/roundonejs_mugen_renderer/';
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
                        MUGEN_RENDERER + 'src/player.js',
                        MUGEN_RENDERER + 'src/resource.js',
                        MUGEN_RENDERER + 'src/app.js',
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
                    'player': './' + MUGEN_RENDERER + 'src/player.js',
                    'resource': './' + MUGEN_RENDERER + 'src/resource.js',
                    'app': './' + MUGEN_RENDERER + 'src/app.js',
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
