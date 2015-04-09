var dest = "./build";
var src = './src';

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest
        }
    },

    sass: {
        src: src + "/sass/**/*.{sass,scss}",
        dest: dest,
        settings: {
            // Enable .sass syntax!
            indentedSyntax: true,
            // Used by the image-url helper
            imagePath: 'images'
        }
    },

    images: {
        src: src + "/images/**",
        dest: dest + "/images"
    },

    markup: {
        src: src + "/htdocs/**",
        dest: dest
    },

    iconFonts: {
        name: 'Gulp Starter Icons',
        src: src + '/icons/*.svg',
        dest: dest + '/fonts',
        sassDest: src + '/sass',
        template: './gulp/tasks/iconFont/template.sass.swig',
        sassOutputName: '_icons.sass',
        fontPath: 'fonts',
        className: 'icon',
        options: {
            fontName: 'Post-Creator-Icons',
            appendCodepoints: true,
            normalize: false
        }
    },

    /**
     * A separate bundle will be generated for each bundle config in the list below.
     */
    browserify: {
        bundleConfigs: [{
            entries: src + '/javascript/global.coffee',
            dest: dest,
            outputName: 'global.js',
            // Additional file extentions to make optional
            extensions: [],
            // list of modules to make require-able externally
            require: []
            // See https://github.com/greypants/gulp-starter/issues/87 for note about
            // why this is 'backbone/node_modules/underscore' and not 'underscore'
        },
        {
            entries: src + '/javascript/page.js',
            dest: dest,
            outputName: 'page.js',
            // list of externally available modules to exclude from the bundle
            external: []
        }]
    },

    production: {
        cssSrc: dest + '/*.css',
        jsSrc: dest + '/*.js',
        dest: dest
    }
};
