exports.render = function (input, out) {
    var _s = "";
    var fs = require('fs');

    if (input.bower && input.package) { // readme file 처리
        var bower = JSON.parse(fs.readFileSync(input.bower, 'utf8'));
        var package = JSON.parse(fs.readFileSync(input.package, 'utf8'));

        _s = '<img src="https://img.shields.io/badge/Bower-' + bower.version + '-blue.svg" alt="Bower-' + bower.version + '" /> ' +
            '<img src="https://img.shields.io/badge/NPM-' + package.version + '-blue.svg" alt="NPM-' + package.version + '" /> ' +
            '<div class="DH5"></div>';
    }
    else {

    }

    out.write(_s);
};