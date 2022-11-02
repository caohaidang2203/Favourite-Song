const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const previousBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: 'Có chơi có chịu',
            singer: 'Karik',
            path: './music/Co-Choi-Co-Chiu-Karik-Only-C.mp3',
            image: './image/co-choi-co-chiu.jpg'
        },
        {
            name: 'Sao cũng được',
            singer: 'Thành Đạt',
            path: './music/Sao-Cung-Duoc-Thanh-Dat.mp3',
            image: './image/sao-cung-duoc.jpg'
        },
        {
            name: 'Tòng phu',
            singer: 'Keyo',
            path: './music/Tong-Phu-Keyo.mp3',
            image: './image/tong-phu.jpg'
        },
        {
            name: 'Vô Lượng',
            singer: 'Masew ft Khôi Vũ',
            path: './music/Vo-Luong-Masew-Khoi-Vu-Great.mp3',
            image: './image/vo-luong.jpg'
        },
        {
            name: 'Bên trên tầng lầu',
            singer: 'Tăng Duy Tân',
            path: './music/BenTrenTangLau-TangDuyTan-7412012.mp3',
            image: './image/ben-tren-tang-lau.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng M-TP',
            path: './music/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3',
            image: './image/muon-roi-ma-sao-con.png'
        },
        {
            name: 'Bài này không để đi diễn',
            singer: 'Anh Tú Atus',
            path: './music/BaiNayKhongDeDiDien-AnhTuAtus-8076045.mp3',
            image: './image/bai-nay-khong-de-di-dien.jpg'
        },
        {
            name: 'Một mình có buồn không',
            singer: 'Thiều Bảo Trâm',
            path: './music/MotMinhCoBuonKhong1-ThieuBaoTramLouHoang-6738011.mp3',
            image: './image/mot-minh-co-buon-khong.jpg'
        },
        {
            name: 'Waiting for you',
            singer: 'Mono',
            path: './music/WaitingForYou-MONOOnionn-7733882.mp3',
            image: './image/waiting-for-you.jpg'
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index=${index}>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
       playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        //Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //Xử lý phóng to, thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
   
        //Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        //Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //Khi bài hát bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration*100);
                progress.value = progressPercent;
            }
        }

        //Xử lý khi tua song khi có sự thay đổi
        progress.oninput = function(e) {
            const seekTime = e.target.value/100*audio.duration;
            audio.currentTime = seekTime;
        }
        //Khi next song 
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            _this.isRepeat = false;
            repeatBtn.classList.remove('active');
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        //Khi previous song
        previousBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.previousSong();
            }
            _this.isRepeat = false;
            repeatBtn.classList.remove('active');
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        //Xử lý random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //Xử lý repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Xử lý ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //Lắng nghe hành vi click song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                //Xử lý khi click song
                if(songNode){
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                //Xử lý khi click option
            }
        }
    },

    //Xử lý scroll active song
    scrollToActiveSong: function() {
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'center',
            });
        }, 300);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    previousSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe và sử lý các sự kiện (DOM events)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }
}

app.start();
