const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Mood",
      singer: "Lofi version",
      path: "./assets/music/Mood.mp3",
      image: "./assets/imgofmusic/img1.jpg",
    },
    {
      name: "Hero",
      singer: "Feat. Christina Perri",
      path: "./assets/music/Hero.mp3",
      image: "./assets/imgofmusic/img2.jpg",
    },
    {
      name: "Ngày đầu tiên",
      singer: "Đức Phúc",
      path: "./assets/music/ngaydautien.mp3",
      image: "./assets/imgofmusic/img3.jpg",
    },
    {
      name: "Chỉ muốn bên em lúc này",
      singer: "Huy Vạc",
      path: "./assets/music/ChiMuonBenEmLucNay-HuyVac.mp3",
      image: "./assets/imgofmusic/chimuonbenemlucnay.jpg",
    },
    {
      name: "Cô ấy nói",
      singer: "Ngô Ánh Đạt",
      path: "./assets/music/CoAyNoi-NgoAnhDat.mp3",
      image: "./assets/imgofmusic/coaynoi.jpg",
    },
    {
      name: "Kẻ theo đuổi ánh sáng",
      singer: "Huy Vạc",
      path: "./assets/music/KeTheoDuoiAnhSang-HuyVac.mp3",
      image: "./assets/imgofmusic/ketheoduoianhsang.jpg",
    },
    {
      name: "Có hẹn với thanh xuân",
      singer: "Monstar",
      path: "./assets/music/cohenvoithanhxuan.mp3",
      image: "./assets/imgofmusic/cohenvoithanhxuan.jpg",
    },
    {
      name: "Nụ cười em là nắng",
      singer: "Green",
      path: "./assets/music/nucuoiemlanang.mp3",
      image: "./assets/imgofmusic/nucuoiemlanang.jpg",
    },
    {
      name: "Những gì anh nói",
      singer: "Bozitt ",
      path: "./assets/music/nhunggianhnoi.mp3",
      image: "./assets/imgofmusic/nhunggianhnoi.jpg",
    },
    {
      name: "Mình anh nơi này",
      singer: " NIT,Sing",
      path: "./assets/music/minhanhnoinay.mp3",
      image: "./assets/imgofmusic/minhanhnoinay.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map(function (song, index) {
      return `<div class="song ${
        index === app.currentIndex ? "active" : ""
      }" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer} </p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
    });
    playList.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    const cdwidth = cd.offsetWidth;
    //xu li cd quay va dung
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    //xu li phong to thu nho cd
    document.onscroll = function () {
      const scrolltop = window.scrollY || document.documentElement.scrollTop;
      const cdNewWidth = cdwidth - scrolltop;
      cd.style.width = cdNewWidth > 0 ? cdNewWidth + "px" : 0;
      cd.style.opacity = cdNewWidth / cdwidth;
    };

    //xu li khi clickplay
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
        cdThumbAnimate.pause();
      } else {
        audio.play();
        cdThumbAnimate.play();
      }
    };

    //khi bai hat duoc playlist

    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
    };
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
    };
    //khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //xu li khi tua bai hat
    progress.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    //khi bam next
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      cdThumbAnimate.play();
      app.render();
      app.scrollToActiveSong();
    };

    //khi bam prev
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      cdThumbAnimate.play();
      app.render();
      app.scrollToActiveSong();
    };

    //xu li random bat tat
    randomBtn.onclick = function (e) {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
    };
    //xu li repeat bat tat
    repeatBtn.onclick = function (e) {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    // xu li khi audio ended
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    //bam chon bai hat
    playList.onclick = function (e) {
      //xu li khi click vao listsong
      const songNodes = e.target.closest(".song:not(.active)");
      if (songNodes || e.target.closest(".option")) {
        if (songNodes) {
          app.currentIndex = Number(songNodes.dataset.index);
          app.loadCurrentSong();
          app.render();
          audio.play();
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(function () {
      if ((app.currentIndex === 0, 1)) {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      } else {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    this.defineProperties();
    //
    this.handleEvent();
    //
    this.loadCurrentSong();
    //
    this.render();
  },
};
app.start();
