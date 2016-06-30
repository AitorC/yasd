//./node_modules/.bin/mocha-phantomjs test/test.html
module.exports = function(grunt) {
    return {
        exec: {
            test: {
                cmd: '"./node_modules/.bin/mocha-phantomjs" test/test.html'
            }
        }
    };
};
