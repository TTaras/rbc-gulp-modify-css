var through = require('through2');
var PluginError = require('gulp-util').PluginError;

module.exports = function(config) {

    var transform = function(file, encoding, callback) {
        if (!file || !file.contents) {
            return callback(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('rbc-gulp-modify-css', 'Streaming not supported!'));
            return callback(null, file);
        }

        if (!config || !config[file.path] || !config[file.path].length) {
            this.emit('error', new PluginError('rbc-gulp-modify-css', 'Error config!'));
            return callback(null, file);
        }
        config = config[file.path];

        var contents = file.contents ? file.contents.toString() : '';
        for (var i = 0; i < config.length; i++) {
            if (config[i].find && config[i].result) {
                contents = contents.replace(new RegExp(config[i].find, 'g'), config[i].result);
            }
        }

        file.contents = new Buffer(contents);
        callback(null, file);
    };

    return through.obj(transform);
};
