var debug = false;
var player = true;

var UI = new UbuntuUI();

window.onload = function () {
    UI.init();

    var recorder;
    var chunks;

    // request permission to access audio stream
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        // store streaming data chunks in array
        //const chunks = [];
        // create media recorder instance to initialize recording
        recorder = new MediaRecorder(stream);
        // function to be called when data is received
        recorder.ondataavailable = e => {
            // add stream data to chunks
            chunks.push(e.data);
            // if recorder is 'inactive' then recording has finished
            if (recorder.state == 'inactive') {
                // convert stream data chunks to a 'webm' audio format as a blob
                const blob = new Blob(chunks, { type: 'audio/webm' });
                // convert blob to URL so it can be assigned to a audio src attribute
                if(player) {
                    $('#debugPlayer').empty();
                    createAudioElement(URL.createObjectURL(blob), $('#debugPlayer'));
                }
            }
        };
        /*
        // setTimeout to stop recording after 4 seconds
        setTimeout(() => {
            // this will trigger one final 'ondataavailable' event and set recorder state to 'inactive'
            recorder.stop();
        }, 4000);
        */
    }).catch(console.error);

    var recButton = $('#record')

    // prevent openening contextmenu
    recButton.bind('contextmenu', function(e) {
        e.preventDefault();
        return false;
    }, false);

    recButton.click(function() {
        //console.log("record start");
        if(!debug) {
            //rec.clear();
            if(recorder.state !== 'recording') {
                $('#record').addClass('recording');

                chunks = [];
                recorder.start();
                
                setTimeout(() => {
                    // this will trigger one final 'ondataavailable' event and set recorder state to 'inactive'
                    if(recorder.state == 'recording')
                    {
                        recorder.stop();
                        $('#record').removeClass('recording');
                    }
                }, 10000);
            }
            else {
                recorder.stop();
                $('#record').removeClass('recording');
            }
        }
    });
};


// appends an audio element to playback and download recording
function createAudioElement(blobUrl, parent) {
    const downloadEl = document.createElement('a');
    downloadEl.style = 'display: block';
    downloadEl.innerHTML = 'download';
    downloadEl.download = 'audio.webm';
    downloadEl.href = blobUrl;
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    const sourceEl = document.createElement('source');
    sourceEl.src = blobUrl;
    sourceEl.type = 'audio/webm';
    audioEl.appendChild(sourceEl);
    parent.append(audioEl);
    parent.append(downloadEl);
}