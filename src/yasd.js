(function() {
    var targetDoc;
    var completionMap = {};
    var idHelper = 0;
    var yasd;

    //Function to add a script
    function addScript(src, loadCb, errorCb) {
        var s = document.createElement('script'); // Create a script element
        s.type = 'text/javascript'; // optional in html5
        s.async = true;                           // asynchronous? true/false
        s.src = (yasd.path && !(/^(http(s)?:)?\/\//).test(src) ? yasd.path : '') + src;
        s.onload = loadCb;
        s.onerror = errorCb;
        //Send to the end of the queue
        setTimeout(function() {
            var fs = document.getElementsByTagName('script')[0];  // Get the first script
            fs.parentNode.insertBefore(s, fs);
        }, 0);
    }

    function markAsLoaded(id, hasErrors) {
        var record = completionMap[id];
        var cb;
        record.state = hasErrors ? -2 : 1;
        //Check if making calls in order makes sense or not
        //Actual is calling in reverse declaration order
        while (cb = record.callbacks.pop()) {
            cb.apply(null, hasErrors ? [hasErrors] : []);
        }
    }

    /**
     * @param {String|Array} script (Or alias if yasd.map is declared)
     * @param {String|Function} idcb An id for the download or a callback function for download completion.
     *        <b>Please note:</b> If an id is specified and an alias is used, id will be completely ignored
     *        not even events will be triggered
     * @param {Function} cb If nor specified before, this will be used as callback on download completion
     */
    yasd = function yads(script, idcb, cb) {
        var type = ((typeof script)[0] + (script && !!script.length)).slice(0, 2);
        var mappedScript = yasd.map ? yasd.map[script] : false;
        var isSecondCallBack = (typeof idcb).match(/^(f|u)/);
        if (mappedScript) {
            return yasd(mappedScript, script, isSecondCallBack ? idcb : cb);
        }

        if (isSecondCallBack) {
            return yasd(script, type === 'st' ? script : idHelper++ , idcb);
        }

        var completedCounter = type === 'ot' ? script.length : 1;
        var hasErrors = false;
        var middleCallback = function(err) {
            hasErrors = hasErrors || !!err;
            if (--completedCounter === 0) {
                markAsLoaded(idcb, hasErrors);
            }
        };

        var state;
        if (completionMap[idcb]) {
            state = completionMap[idcb].state;
            if (cb && state <= 0) {
                completionMap[idcb].callbacks.push(cb);
            }

            if (state >= 0) {
                return state === 1 && cb ? cb() : null, yasd;
            }

            completionMap[idcb].state = 0;
        } else {
            completionMap[idcb] = {
                state: 0,
                callbacks: cb ? [cb] : []
            };
        }

        if (type !== 'st') {
            //It's not a string
            for (var key in script) {
                yasd(script[key], typeof script[key] === 'string' ? script[key] : idHelper++, middleCallback);
            }
            return yasd;
        }

        addScript(script, function() {
            middleCallback();
        }, middleCallback);

        return yads;
    };

    /**
     * @param {String} id Id or path (or URL) of the resource
     * @param {Function} fnc Callback to be executed when the resource is ready (or an error has occurred)
     */
    yasd.on = function(id, fnc) {
        var record = completionMap[id];
        if (!record) {
            completionMap[id] = {
                state: -1,
                callbacks: [fnc]
            };
        } else if (record.state === 0) {
            record.callbacks.push(fnc);
        }
        return yasd;
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = function(document) {
            targetDoc = document;
            return yasd;
        };
    } else {
        if (typeof define === 'function' && define.amd) {
            define(function() {
                return yasd;
            });
        } else {
            if (window.yasd) {
                yasd.path = window.yasd.path || '';
                yasd.map = window.yasd.map || undefined;
            }
            window.yasd = yasd;
        }
    }
})();
