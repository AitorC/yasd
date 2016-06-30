# YASD (yeat another script downloader)
## What is Yasd?
It's just what it's name claims to be, a lightweight library to inject javascript files into an html document (header). It's best suited for application tht download scripts on-demand, or just a simple dependency downloader. Yasd always injects scripts with "async" attrbite. It also features mapping, callbacks, event like calls and path prefixing.

## Usage
A sample of it's different use cases looks like this:
```javascript

yasd('http://some.host.com/script.js', function(err) {
    if (err) {
        console.error('http://some.host.com/script.js couldn\'t load!');
    } else {
        console.log('http://some.host.com/script.js is loaded and ready to use!')
    }
});

//Path prefixing support
yasd.path = '/scripts/';

yasd('myScript.js', 'myId', function(err) {
    if (err) {
        console.error('I\'ll say again: ... /scripts/myScript.js couldn\'t load!');
    }
});

yasd.on('myId', function(err) {
    if (err) {
        console.error('/scripts/myScript.js couldn\'t load!');
    }
});

//Map of aliases support
yasd.map = {
    'myAlias': '//just.some.host.com/justAScript.js',
    'myOtherAlias': 'someScript.js'
};

yasd(['myAlias', 'myOtherAlias'], 'ignoredAlias', function(err) {
    if (err) {
        console.error('//just.some.host.com/justAScript.js and/or /scripts/someScript.js couldn\'t load!');
    }
}).on('ignoredAlias', function() {
    console.warn('You will never see this message because "ignoredAlias" is ignored by Yasd!');
});

yasd.on('myOtherAlias', function(err) {
    if (err) {
        console.error('/scripts/someScript.js couldn\'t load!');
    }
}).on('myAlias', function(err) {
    if (err) {
        console.error('//just.some.host.com/justAScript.js couldn\'t load!');
    }
});
```

## Compatibility
Yet to be tested!

## Build Yasd
Yasd uses grunt (grunt-cli should be installed) and npm to be built:
```
npm install -dev
grunt
```

## Testing
For testing Yasd it is required to have all dev dependencies installed with `npm install -dev`
```
npm test
```
