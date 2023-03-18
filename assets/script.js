const audio = document.getElementById('audio');
const audio2 = document.getElementById('audio2');
const lyricsDiv = document.getElementById('lyrics');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const progressBar = document.querySelector('#progress-bar span');
const progress = document.getElementById("progress-bar");
const time = document.getElementById("time");
const title = document.getElementById("title");
const author = document.getElementById("author");
const select = document.getElementById("song-select");
const music = document.getElementById("music");
const info = document.getElementById("song-info");
const div2 = document.getElementById("div2");
const div4 = document.getElementById("score-div");
const reBtn = document.getElementById("re-btn");
const h4 = document.getElementById("h4");
const score2 = document.getElementById("score");
const acBtn = document.getElementById("ac");
const scBtn = document.getElementById("settingb");
const sc = document.getElementById("setting");
const scc = document.getElementById("settingc");
const vx = document.getElementById("volume-up-btn");
const vy = document.getElementById("volume-down-btn");
const vo = document.getElementById("vo");
const nick = document.getElementById("nick");

audio.volume -= 0.2;

const songTitles = {
    "song1": "W / X / Y (on-vocal)",
    "song2": "W / X / Y",
};
const songAuthors = {
    "song1": "Tani Yuuki",
    "song2": "Tani Yuuki",
};

const score = Math.floor( Math.random() * 14 ) + 78;

var audio_context;
var recorder;

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  audio_context.resume();

  // Uncomment if you want the audio to feedback directly
  //input.connect(audio_context.destination);
  //__log('Input connected to audio context destination.');
  
  recorder = new Recorder(input);
}

function startRecording(button) {
  recorder && recorder.record();
}

function stopRecording(button) {
  recorder && recorder.stop();
  div2.removeAttribute("hidden");
  // create WAV download link using audio data blob
  createDownloadLink();
  
  recorder.clear();
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbqzbuzNehknoZLGWdbPRmVxzZ4EmRymY",
  authDomain: "karaoke-web-e528e.firebaseapp.com",
  projectId: "karaoke-web-e528e",
  storageBucket: "karaoke-web-e528e.appspot.com",
  messagingSenderId: "148600419627",
  appId: "1:148600419627:web:e31d929e3baa8c49f4c16e"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to Firebase Storage
var storageRef = firebase.storage().ref();

// Create a download link for the recorded audio
function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);;
        audio2.src = url;
        const fname = new Date().toISOString();
        var filePath = 'WXY/' + fname + '.wav';
        var fileRef = storageRef.child(filePath);
        fileRef.put(blob).then(function(snapshot) {        
        });
    });
}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // First get ahold of the legacy getUserMedia, if present
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(new Error('このブラウザではご利用になれません。'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }
    window.URL = window.URL || window.webkitURL;
    
    audio_context = new AudioContext;
  } catch (e) {
    alert('No web audio support in this browser!');
  }
  
  navigator.mediaDevices.getUserMedia({audio: true})
    .then(function(stream) {
      startUserMedia(stream);
    })
    .catch(function() {
      alert('マイクへのアクセスを許可して下さい。');
      acBtn.removeAttribute("hidden");
  });
};

function getMedia(){
  navigator.mediaDevices.getUserMedia({audio: true})
  .then(function(stream) {
    startUserMedia(stream);
    select.removeAttribute("hidden");	
    acBtn.setAttribute("hidden", "hidden");
  })
  .catch(function() {
    alert('マイクへのアクセスを許可して下さい。');
});
}

playBtn.addEventListener('click', () => {
    audio.play();
    playBtn.setAttribute("hidden", "hidden");
    stopBtn.removeAttribute("hidden");
    pauseBtn.removeAttribute("hidden");
    select.setAttribute("hidden", "hidden");
    music.setAttribute("hidden", "hidden");
    info.removeAttribute("hidden");	
    progress.removeAttribute("hidden");		
});

pauseBtn.addEventListener('click', () => {
    audio.pause();
    pauseBtn.setAttribute("hidden", "hidden");
    playBtn.removeAttribute("hidden");
});

vx.addEventListener('click', () => {
  audio.volume += 0.1;
  const disv = Math.round(audio.volume * 10)
  const v = disv-8;
  const v2 = Math.sign(v)

  if (v2 < 0){
    vo.innerHTML = v;
  }

  else if (disv > 9) {
    vo.innerHTML = "Max";
  }

  else if (disv < 1) {
    vo.innerHTML = "Min";
  }
  else{
    vo.innerHTML = "＋" + v;

  }
});

vy.addEventListener('click', () => {
  audio.volume -= 0.1;
  const disv = Math.round(audio.volume * 10)
  const v = disv-8;
  const v2 = Math.sign(v)

  if (v < -7) {
    vo.innerHTML = "Min";
  }
  else if (v2 < 0){
    vo.innerHTML = v;
  }

  else if (disv > 9) {
    vo.innerHTML = "Max";
  }

  else{
    vo.innerHTML = "＋" + v;

  }
});

scBtn.addEventListener('click', () => {
  sc.removeAttribute("hidden");
  scc.removeAttribute("hidden");
  scBtn.setAttribute("hidden", "hidden");
});

scc.addEventListener('click', () => {
  sc.setAttribute("hidden", "hidden");
  scc.setAttribute("hidden", "hidden");
  scBtn.removeAttribute("hidden");
});

reBtn.addEventListener('click', () => {
  location.reload();
});

stopBtn.addEventListener('click', () => {
    audio.pause();
    progressBar.style.width = '0';
    audio.currentTime = 0;
    score2.innerHTML = score;
    stopBtn.setAttribute("hidden", "hidden");
    playBtn.setAttribute("hidden", "hidden");
    pauseBtn.setAttribute("hidden", "hidden");
    info.setAttribute("hidden", "hidden");
    progress.setAttribute("hidden", "hidden");
    music.removeAttribute("hidden");
    h4.removeAttribute("hidden");
    div4.removeAttribute("hidden");
});

audio2.addEventListener("play", () => {
  audio.play();
});

audio.addEventListener('timeupdate', () => {
const currentTime = audio.currentTime;
const duration = audio.duration;
const progress = (currentTime / duration) * 100;

progressBar.style.width = `${progress}%`;
if (!isNaN(duration)) {
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        const formattedCurrentTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        const remainingTime = duration - currentTime;
        const remainingMinutes = Math.floor(remainingTime / 60);
        const remainingSeconds = Math.floor(remainingTime % 60);
        const formattedRemainingTime = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;

        time.innerHTML = `${formattedRemainingTime}` + 'ㅤ';
    }
});
var songs = {
    'song1': {
        'audio': './assets/songs/on.mp3',
        'lyrics': ['♪', '垂れ流したテレビの音', '溜めてしまった洗濯物は今日こそ', '晴れでもあえて外には出ないでいよう', '輝き弛まぬように歌うメロディ', '二人酸いも甘いも', '噛み合わないとしても', 'お互い寄り添うように  少しずらしてみようよ', '君がくれた太陽', '月で隠れないよう', '輝き弛まぬように歌うメロディ', '戯れるSlowly flowing day', '愛してるも通り越して', '似た者同士こうして', '年老いるまで笑っていたいね', '君がいなきゃlonely lonely day', '夢の中　Fall asleep in bed.', '起こすからmorning callで', 'I’ll protect you from nightmares, Baby', '♪']
    },
    'song2': {
        'audio': './assets/songs/off.mp3',
        'lyrics': ['♪', '垂れ流したテレビの音', '溜めてしまった洗濯物は今日こそ', '晴れでもあえて外には出ないでいよう', '輝き弛まぬように歌うメロディ', '二人酸いも甘いも', '噛み合わないとしても', 'お互い寄り添うように  少しずらしてみようよ', '君がくれた太陽', '月で隠れないよう', '輝き弛まぬように歌うメロディ', '戯れるSlowly flowing day', '愛してるも通り越して', '似た者同士こうして', '年老いるまで笑っていたいね', '君がいなきゃlonely lonely day', '夢の中　Fall asleep in bed.', '起こすからmorning callで', 'I’ll protect you from nightmares, Baby', '♪']
}
}

audio.addEventListener("ended", () => {
    progressBar.style.width = '0';
    audio.currentTime = 0;
    stopBtn.click();
});

audio2.addEventListener("ended", () => {
    audio.pause();
});


$(document).ready(function(){
    // Play the audio of the selected song
    $('#song-select').on('change', function(){
        var song = $('#song-select').val();
        var audio = $('#audio').get(0);
        const selectedSong = document.getElementById("song-select").value;
        playBtn.removeAttribute("hidden");
        title.innerHTML = songTitles[selectedSong];
        author.innerHTML = songAuthors[selectedSong];
        audio.src = songs[song].audio;
        audio.load();
        // Display the lyrics
        var lyrics = songs[song].lyrics;
        var html = '';
        for(var i=0; i<lyrics.length; i++){
            html += '<p>'+lyrics[i]+'</p>';
        }
        $('#lyrics').html(html);
    });
    // Change the color of the lyrics according to the time difference
});
