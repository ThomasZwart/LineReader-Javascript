var LineReader = function (file, chunkSize) {
    if (!(this instanceof LineReader)) {
        return new LineReader(file, chunkSize);
    };

    // Initializing internal variables
    var internals = this._internals = {};
    var self = this;
    internals.chunkSize = chunkSize || 1024;
    internals.reader = new FileReader();
    internals.file = file;
    
    internals.events = {};
    internals.beginByte = 0;
    internals.lastLine = "";
    

    internals.reader.onload = function() {
        if (this.readyState == FileReader.DONE) {
            // If there is no newline in the original chunk, double it untill a newline is found
            if (this.result.search("\n") == -1 && hasMoreData()) {
                // Because we read again with bigger chunksize the beginbyte gets set back
                internals.beginByte = internals.beginByte - internals.chunkSize;
                internals.chunkSize = internals.chunkSize * 2;

                // Chunksize can't extend the file size
                if (internals.chunkSize >= internals.file.size) {
                    // +1 for the last newline
                    internals.chunkSize = internals.file.size + 1;
                };

                self.read();
                return;
            };

            /* Split all the lines in an array, the chunk problably won't be a multiple of the amount of bytes
             per line and the amount of bytes per line will not be constant. So we remove the lastline and store it in 
             an internal variable and add it to the first line on the next read which will also be part of a full line.
             This way only full lines are given to the event.
             */
            var lines = this.result.split('\n');
            lines[0] = internals.lastLine + lines[0];

            if (hasMoreData()) {
                internals.lastLine = lines[lines.length - 1];
                lines.splice(lines.length - 1, 1);
            };
            
            // Emit the line event on this object.
            self._emit("lines", lines);

            // If there is more data, read again.
            if (hasMoreData()) {
                self.read();
            };
        };
    };

    function hasMoreData() {
        return internals.beginByte <= internals.file.size;
    };

    // Subscribing events
    this.on = function(eventName, cb) {
        this._internals.events[eventName] = cb;
    };

    // To emit a given event with arguments
    this._emit = function(event, args) {
        var boundEvents = this._internals.events;

        if (typeof boundEvents[event] === 'function') {
            boundEvents[event].call(this, args);
        };
    };

    this.read = function () {
        var blob = internals.file.slice(internals.beginByte, internals.beginByte + internals.chunkSize);
        // Update the position where reading begins
        internals.beginByte += internals.chunkSize;

        internals.reader.readAsText(blob);
    };
};