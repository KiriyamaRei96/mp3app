var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

var parser = new DOMParser();
var audioTime = $("#audio-time");
var current = $("#current-Time");
var play = $("#play");
var thumbnail = $(".thumbnail");
var audio = $("#audio");
var mute = $(".controler-volume");
var volume = $("#volume");
var length = $("#length");
var title = $(".title-content");
var renderArr = [];
var songList = $(".song-list");
var next = $(".fa-solid.fa-forward-step");
var back = $(".fa-solid.fa-backward-step");
var options = $(".controler-options");

url = [
  "https://m.zingmp3.vn/xhr/media/get-source?type=audio&key=kmJmtLGNWBZSRxsyHtvmLmTkhQddiQxFS",
  "https://m.zingmp3.vn/xhr/media/get-source?type=audio&key=LncmydSZmzhayHyFHkGTZhpdZWaEmc",
  "https://m.zingmp3.vn/xhr/media/get-source?type=audio&key=ZHxmtkGauGxCZxGyHtvmLnykhQdLQsJmC",
  "https://m.zingmp3.vn/xhr/media/get-source?type=audio&key=LmcHygFxaZLxyGybHkmtLhWBZpcnxs",
  "https://m.zingmp3.vn/xhr/media/get-source?type=audio&key=kHcHtZniLncFLWVTmybGLGyLgWBkWcQhL",
  "https://m.zingmp3.vn/xhr/media/get-source?type=audio&key=ZGcmykHsQlxsxbatHtbnLHyLgpBLpQkpg",
];
url.map((item, index) => {
  return fetch(item)
    .then((respon) => respon.json())
    .then((data) => {
      return data.data;
    })
    .then((data) => {
      var renderObj = {
        Name: data.name,
        artist: data.artists_names,
        duration: data.duration,
        photo: `https://photo-resize-zmp3.zmdcdn.me/w480${data.thumbnail.slice(
          39
        )}`,
        source: data.source[128],
      };
      return renderObj;
    })
    .then((obj) => {
      renderArr.push(obj);
      shuffleAr.push(obj);
      for (index in renderArr) {
        renderArr[index].id = index;
      }
      songlistRender(obj);

      render(renderArr[0]);
      var songs = $$(".song-list--item");
      return songs;
    })
    .then((songs) => {
      for (song of songs) {
        song.onclick = function () {
          id = this.dataset.id;
          if (id != audio.dataset.id) {
            render(renderArr[id]);
            if (audioCondtion) {
              audio.play();
            }
          }
        };
      }
    });
});

// render
function songlistRender(obj) {
  let songInfo = document.createElement("div");
  songInfo.classList.add("song-list--item");
  songInfo.dataset.id = obj.id;

  songInfo.innerHTML = `
    <img
    src=${obj.photo}
    alt=""
    class="song-list--item-img"
  />
  <div class="song-list--item-info">
    <h4 class="item-info--title"> ${obj.Name}</h4>
    <span class="item-info--artist">${obj.artist}</span>
     `;
  songList.appendChild(songInfo);
}
function render(obj) {
  audio.dataset.id = obj.id;
  audio.src = obj.source;
  thumbnail.children[0].src = obj.photo;
  title.innerText = obj.Name;
  obj.duration / 60 < 10
    ? (Min = `0${Math.floor(obj.duration / 60)}`)
    : (Min = Math.floor(obj.duration / 60));
  obj.duration % 60 < 10
    ? (Sec = `0${Math.floor(obj.duration % 60)}`)
    : (Sec = Math.floor(obj.duration % 60));
  audioTime.innerText = `${Min}:${Sec}`;
  length.max = Math.round(obj.duration);
  length.value = 0;
  thumbnail.children[0].classList.remove("rotate");
}
// update
function time() {
  let currentMin, currentSec;
  crrTime = length.value;
  crrTime / 60 < 10
    ? (currentMin = `0${Math.floor(crrTime / 60)}`)
    : (currentMin = Math.floor(crrTime / 60));
  crrTime % 60 < 10
    ? (currentSec = `0${Math.floor(crrTime % 60)}`)
    : (currentSec = Math.floor(crrTime % 60));
  current.innerText = `${currentMin}:${currentSec}`;
}
function update() {
  setTimeout(time(), 1000);

  length.value = audio.currentTime;
  length.style = `background-size:${Math.ceil(
    (length.value / audio.duration) * 100
  )}%`;
}
var audioCondtion;
play.onclick = function () {
  if (audio.paused) {
    audio.play();
    play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    audioCondtion = true;
  } else {
    audio.pause();
    play.innerHTML = `<i class="fa-solid fa-play"></i>`;
    audioCondtion = false;
  }
};
audio.onloadeddata = function () {};
audio.onplay = function () {
  thumbnail.children[0].classList.add("rotate");
};
audio.onpause = function () {
  thumbnail.children[0].classList.remove("rotate");
};

audio.ontimeupdate = () => {
  update();
};
// time change
length.onchange = function () {
  audio.currentTime = length.value;
};

length.oninput = function () {
  time();
};
length.onchange = function () {
  audio.currentTime = length.value;
};
length.onmousedown = function () {
  audio.ontimeupdate = function () {};
};
length.onmouseup = function () {
  audio.ontimeupdate = function () {
    update();
  };
};
// volume.onchange = function () {
//   audio.volume = this.value / 100;
// };

// mute
mute.onclick = function () {
  if (audio.muted) {
    audio.muted = false;
    mute.innerHTML = ` <i class="fa-solid fa-volume-high"> </i>`;
  } else {
    audio.muted = true;
    mute.innerHTML = ` <i class="fa-solid fa-volume-xmark"></i>`;
  }
};

audio.onended = () => {
  forward();
};

// song change
var forward = () => {
  let id = Number(audio.dataset.id) + 1;
  if (id > renderArr.length - 1) {
    id = 0;
  }

  render(renderArr[id]);
  if (audioCondtion) {
    audio.play();
  }
};
next.onclick = () => {
  forward();
};
back.onclick = () => {
  let id = Number(audio.dataset.id) - 1;
  if (id < 0) {
    id = renderArr.length - 1;
  }

  render(renderArr[id]);
  if (audioCondtion) {
    audio.play();
  }
};
var shuffleAr = [];
var playEd = [];

// shuffle
function shuffle(arr) {
  shuffleArr = [];
  renderArr.forEach((song) => {
    for (item of arr) {
      if (song != item) {
        shuffleArr.push(song);
      }
    }
  });
  id = Math.floor(Math.random() * shuffleAr.length);

  render(shuffleAr[id]);
  shuffleAr.splice(id, 1);
  audio.play();
  if (shuffleAr.length == 0) {
    shuffleAr = playEd;
    playEd = [];
  }
}
options.onclick = function () {
  switch (this.dataset.option) {
    case "normal":
      this.dataset.option = "repeat";
      this.classList.add("active");
      audio.loop = true;
      break;
    case "repeat":
      this.classList.remove("fa-repeat");
      this.classList.add("fa-shuffle");
      this.dataset.option = "shuffle";
      audio.loop = false;

      audio.onended = () => {
        song = renderArr.find((song) => {
          return song.id == audio.dataset.id;
        });
        playEd.push(song);
        shuffle(playEd);
      };
      break;
    case "shuffle":
      this.classList.remove("fa-shuffle");
      this.classList.remove("active");
      this.classList.add("fa-repeat");
      this.dataset.option = "normal";
      audio.onended = () => {
        forward();
      };
      break;
  }
};
