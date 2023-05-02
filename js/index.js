let upload = document.querySelector(".upload");
let musicList = document.querySelector(".music-list");
let favoriteList = document.querySelector(".favorite-list");
let search = document.querySelector(".search input");
let songsContent = document.querySelector(".content .songs");
let progressBar = document.querySelector(".progress-bar");
let progressBarP = document.querySelector(".progress-bar p");
let songName = document.querySelector(".song-name");
let controlsFavorite = document.querySelector(".controls-favorite");
let playPause = document.querySelector("#play");
let forward = document.querySelector("#forward");
let backward = document.querySelector("#backward");
let volume = document.querySelector(".volume input");

let musicArr = localStorage.getItem("musicArr") ? getFromLocalStorage() : [];
// [
//   {
//     id: 1,
//     name: "AssalamuAlayka",
//     songPath: "../music/maherZain-AssalamuAlayka.mp3",
//     playing: false,
//     favorite: false,
//   },
//   {
//     id: 2,
//     name: "Asma-ul-Husna",
//     songPath: "../music/Asma-ul-Husna_The-99-Names-v2.mp3",
//     playing: false,
//     favorite: false,
//   },
//   {
//     id: 3,
//     name: "Mawlaya",
//     songPath:
//       "../music/Maher Zain - Mawlaya (Arabic) _ (ماهر زين - مولاي (بدون موسيقى _ Vocals Only - Lyrics.mp3",
//     playing: false,
//     favorite: false,
//   },
// ];
reset();
let currentPlay = 0;
let audio = new Audio();

createMusicList();

musicList.addEventListener("click", createMusicList);
favoriteList.addEventListener("click", favoriteListCreator);

function createMusicList() {
  active("songList");
  createContent(getFromLocalStorage());
  choicesSong();
  selectFavorite();
}

function favoriteListCreator() {
  active("favoriteList");
  createFavoriteContent(getFromLocalStorage());
  choicesSong();
  selectFavorite();
}

// createContent
function createContent(list = []) {
  songsContent.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    songsContent.innerHTML += `<div data-value='${i}' class="item">
            <div>
              <p>${i + 1}</p>
              <div class="play">
              ${
                list[i].playing
                  ? '<i class="play-now fa-solid fa-pause"></i>'
                  : '<i class="play-now fa-solid fa-play"></i>'
              }
              </div>
              <p class="song-name">${list[i].name}</p>
            </div>
            <div>
              <div class="favorite">
              ${
                list[i].favorite
                  ? '<i class="fa-solid fa-heart fa-lg"></i>'
                  : '<i class="fa-regular fa-heart fa-lg"></i>'
              }
              </div>
            </div>
          </div>`;
    let item = document.querySelector(`div[data-value="${i}"]`);
    let data = item.getAttribute("data-value");
    if (data % 2 == 0) {
      item.classList.add("odd");
    } else {
      item.classList.add("even");
    }
  }
}

function createFavoriteContent() {
  songsContent.innerHTML = "";
  // is favorite?
  for (let i = 0; i < musicArr.length; i++) {
    if (musicArr[i].favorite) {
      songsContent.innerHTML += `<div data-value='${i}' class="item">
            <div>
              <p>${i + 1}</p>
              <div class="play">
              ${
                musicArr[i].playing
                  ? '<i class="play-now fa-solid fa-pause"></i>'
                  : '<i class="play-now fa-solid fa-play"></i>'
              }
              </div>
              <p class="song-name">${musicArr[i].name}</p>
            </div>
            <div>
              <div class="favorite">
              ${
                musicArr[i].favorite
                  ? '<i class="fa-solid fa-heart fa-lg"></i>'
                  : '<i class="fa-regular fa-heart fa-lg"></i>'
              }
              </div>
            </div>
          </div>`;
      let item = document.querySelector(`div[data-value="${i}"]`);
      let data = item.getAttribute("data-value");
      if (data % 2 == 0) {
        item.classList.add("odd");
      } else {
        item.classList.add("even");
      }
    }
  }
}

// choices song
function choicesSong() {
  let playNow = document.querySelectorAll(".play");
  let items = document.querySelectorAll(".item");
  for (let i = 0; i < playNow.length; i++) {
    playNow[i].addEventListener("click", () => {
      let selectedSong = items[i].getAttribute("data-value");
      player(selectedSong);
    });
  }
}

// select favorite
function selectFavorite() {
  let favorite = document.querySelectorAll(".item .favorite");
  for (let i = 0; i < favorite.length; i++) {
    favorite[i].addEventListener("click", () => {
      if (!musicArr[i].favorite) {
        musicArr[i].favorite = true;
        favorite[i].innerHTML = `<i class="fa-solid fa-heart fa-lg"></i>`;
      } else {
        musicArr[i].favorite = false;
        favorite[i].innerHTML = `<i class="fa-regular fa-heart fa-lg"></i>`;
      }
      showDetailsInPlayer();
      updateLocalStorage(musicArr);
    });
  }
}

// favorite in the music list
controlsFavorite.addEventListener("click", () => {
  if (musicArr[currentPlay].favorite) {
    musicArr[currentPlay].favorite = false;
    updateLocalStorage(musicArr);
    musicList.classList.contains("active")
      ? createMusicList()
      : favoriteListCreator();
    showDetailsInPlayer();
  } else {
    musicArr[currentPlay].favorite = true;
    updateLocalStorage(musicArr);
    musicList.classList.contains("active")
      ? createMusicList()
      : favoriteListCreator();
    showDetailsInPlayer();
  }
});

// player
function player(index) {
  changeIcons(index);

  if (index != currentPlay) {
    audio.load();
    reset();
    currentPlay = index;
  }

  if (!musicArr[currentPlay].playing) {
    audio = new Audio(musicArr[currentPlay].songPath);
    musicArr[currentPlay].playing = true;
    audio.play();
    document.querySelector("#play svg").classList.add("fa-pause");
  }

  showDetailsInPlayer();
  audio.addEventListener("timeupdate", updateProgress);
  updateLocalStorage(musicArr);
}

// controllers
playPause.addEventListener("click", playPauseFunction);

backward.addEventListener("click", prevSong);

forward.addEventListener("click", nextSong);

// show song details
function showDetailsInPlayer() {
  songName.innerHTML = musicArr[currentPlay].name;
  if (musicArr[currentPlay].favorite && !audio.paused) {
    controlsFavorite.innerHTML = `<i class="fa-solid fa-heart fa-lg"></i>`;
  } else {
    controlsFavorite.innerHTML = `<i class="fa-regular fa-heart fa-lg"></i>`;
  }
}

function changeIcons(i) {
  for (let j = 0; j < musicArr.length; j++) {
    let targetItem = document.querySelector(`div[data-value="${j}"] svg`);
    if (i != j) {
      targetItem?.classList.add("fa-play");
      targetItem?.classList.remove("fa-pause");
    } else {
      targetItem?.classList.remove("fa-play");
      targetItem?.classList.add("fa-pause");
    }
  }
}

// updating progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progressBarP.style.width = `${progressPercent}%`;
  // when the audio is end
  if (duration == currentTime) {
    nextSong();
  }
}

// when click on the progress bar
progressBar.addEventListener("click", function (e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

// volume
volume.addEventListener("input", (e) => {
  audio.volume = e.currentTarget.value / 100;
  volume.style.backgroundSize = `${e.currentTarget.value}% 100%`;
});

function nextSong() {
  currentPlay++;
  audio.load();
  if (currentPlay >= musicArr.length) {
    currentPlay = 0;
  }
  reset();
  player(currentPlay);
  audio.play();
  document.querySelector("#play svg").classList.add("fa-pause");
}

function prevSong() {
  currentPlay--;
  audio.load();
  if (currentPlay < 0) {
    currentPlay = musicArr.length - 1;
  }
  reset();
  player(currentPlay);
  audio.play();
  document.querySelector("#play svg").classList.add("fa-pause");
}

function playPauseFunction() {
  let icon = document.querySelector("#play svg");
  let isPlayable = icon.classList.contains("fa-play");
  if (isPlayable) {
    audio.play();
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  } else {
    audio.pause();
    icon.classList.add("fa-play");
    icon.classList.remove("fa-pause");
  }
}

function reset() {
  for (let i = 0; i < musicArr.length; i++) {
    musicArr[i].playing = false;
  }
  updateLocalStorage(musicArr);
}

// searching
search.addEventListener("keyup", (e) => {
  let arr = musicArr.filter((o) =>
    o.name.toLowerCase().startsWith(search.value.toLowerCase())
  );
  createContent(arr);
});

upload.addEventListener("click", () => {
  let existArr = getFromLocalStorage();
  let arr = [];
  active("upload");
  songsContent.innerHTML = `<input class='ok' accept="audio/*" multiple type="file" />`;
  let files = document.querySelector('input[type="file"');
  files.addEventListener("change", () => {
    for (let i = 0; i < files.files.length; i++) {
      let isExist = existArr?.find((e) =>
        e.name.startsWith(files.files[i].name)
      );
      if (isExist) {
        songsContent.innerHTML = `<p>${files.files[i].name} is already exist</p>
        <input class='ok' accept="audio/*" multiple type="file" />
        `;
      } else {
        arr.push({
          id: i,
          name: files.files[i].name,
          songPath: `../music/${files.files[i].name.replace(/ /g, "-")}`,
          playing: false,
          favorite: false,
        });
        updateLocalStorage(arr);
        musicArr = arr;
      }
    }
  });
});

function updateLocalStorage(arr) {
  localStorage.setItem("musicArr", JSON.stringify(arr));
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("musicArr"));
}

function active(item) {
  switch (item) {
    case "songList":
      musicList.classList.add("active");
      favoriteList.classList.remove("active");
      upload.classList.remove("active");
      break;
    case "favoriteList":
      favoriteList.classList.add("active");
      musicList.classList.remove("active");
      upload.classList.remove("active");
      break;
    case "upload":
      upload.classList.add("active");
      musicList.classList.remove("active");
      favoriteList.classList.remove("active");

    default:
      break;
  }
}
