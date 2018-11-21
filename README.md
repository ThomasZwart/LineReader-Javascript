# LineReader-Javascript
Javascript class that can read a file in chunks of lines using the FileReader object.

Example:

var lineReader = new LineReader(file, chunkSize);

// Event gets an array of full lines from the data

lineReader.on("lines",  
    function (lines) {  
        for (var line = 0; line < lines.length; line++) {         
            // Do something with a line of data              
        };         
    });  
lineReader.read();  


<pre>var lineReader = new LineReader(file, chunkSize);

// Event gets an array of full lines from the data

lineReader.on("lines",  
    function (lines) {  
        for (var line = 0; line < lines.length; line++) {         
            // Do something with a line of data              
        };         
    });  
lineReader.read();  </pre>
