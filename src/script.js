
document.addEventListener("DOMContentLoaded", () => {
    const hover_playBtns = document.querySelectorAll(".hover-play-btn");
    const audioPlayer = document.querySelector("#audioPlayer");
    const playerBox = document.querySelector(".playerBox");
    const PlayPauseBtn = document.querySelector("#PlayPauseBtn");
    const allSongs = Array.from(document.querySelectorAll(".songs"));
    const preBtn = document.querySelector("#preBtn");
    const nextBtn = document.querySelector("#nextBtn");
    const loginAlert = document.querySelector("#loginAlert");
    const loginPopup = document.querySelector("#loginPopup");
    const Left_Btns = document.querySelectorAll(".Left-Btns");
    const signBtn = document.querySelector(".signBtn");
    const loginBtn = document.querySelector(".loginBtn");
    const logoutBtn = document.querySelector(".logoutBtn");
    const progressBar = document.getElementById("progressBar");
    const currTimeEl = document.querySelector(".currTime");
    const totalTimeEl = document.querySelector(".totalTime");

    function checkLogin() {
        return localStorage.getItem("isLoggedIn") === "true";
    }

    const isLoggedIn = checkLogin();
    console.log("Is user logged in? ", isLoggedIn);

    function showPopup() {
        loginAlert.style.display = "flex";
    }

    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("closePopup")) {
            loginAlert.style.display = "none";
            loginPopup.style.display = "none";
        }
    });


    Left_Btns.forEach(Left_Btn => {
        if (!checkLogin()) {
            Left_Btn.addEventListener("click", () => {
                showPopup();
            });
        }

    });

    hover_playBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            if (!checkLogin()) {
                console.log(checkLogin());
                showPopup();
                return;
            }
        });
    });

    let currSongIndex = -1;
    let currentAudioSrc = '';

    let currentHoverBtn = null;


    if (checkLogin()) {
        loginBtn.style.display = "none";
        signBtn.style.display = "none";
        logoutBtn.style.display = " block";
        playerBox.style.display = "block";
        loginPopup.style.display = "flex";

        hover_playBtns.forEach(hover_playBtn => {
            hover_playBtn.addEventListener("click", function () {

                const songDiv = hover_playBtn.closest(".songs");
                currSongIndex = allSongs.indexOf(songDiv);
                const audioSrc = songDiv.getAttribute("data-audio");

                playerBox.style.display = "block";

                currentHoverBtn = hover_playBtn;

                if (!audioSrc) return;

                // play/pause for same song

                if (audioSrc === currentAudioSrc) {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                        PlayPauseBtn.classList.remove("bi-play-circle-fill");
                        PlayPauseBtn.classList.add("bi-pause-circle-fill");
                        hover_playBtn.classList.remove("bi-play-circle-fill");
                        hover_playBtn.classList.add("bi-pause-circle-fill");
                    }
                    else {
                        audioPlayer.pause();
                        PlayPauseBtn.classList.remove("bi-pause-circle-fill");
                        PlayPauseBtn.classList.add("bi-play-circle-fill");
                        hover_playBtn.classList.remove("bi-pause-circle-fill");
                        hover_playBtn.classList.add("bi-play-circle-fill");
                    }
                }
                else {
                    currentAudioSrc = audioSrc;
                    audioPlayer.src = audioSrc;
                    audioPlayer.load();
                    PlayPauseBtn.classList.remove("bi-play-circle-fill");
                    PlayPauseBtn.classList.add("bi-pause-circle-fill");
                    hover_playBtn.classList.remove("bi-play-circle-fill");
                    hover_playBtn.classList.add("bi-pause-circle-fill");

                    audioPlayer.addEventListener("loadedmetadata", () => {
                        progressBar.max = 100;
                        totalTimeEl.textContent = formatTime(audioPlayer.duration);
                        audioPlayer.play();
                        PlayPauseBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
                        hover_playBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
                    }, { once: true });
                }

            });
        });

        PlayPauseBtn.addEventListener("click", () => {
            if (!audioPlayer.src) return;

            if (audioPlayer.paused) {
                audioPlayer.play();
                PlayPauseBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");

                if (currentHoverBtn) {
                    currentHoverBtn.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
                }
            } else {
                audioPlayer.pause();
                PlayPauseBtn.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");

                if (currentHoverBtn) {
                    currentHoverBtn.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
                }
            }
        });


        audioPlayer.addEventListener("loadedmetadata", () => {
            progressBar.max = audioPlayer.duration;
            totalTimeEl.textContent = formatTime(audioPlayer.duration);
        });

        audioPlayer.addEventListener("timeupdate", () => {
            progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            currTimeEl.textContent = formatTime(audioPlayer.currentTime);
        });


        progressBar.addEventListener("input", () => {
            const seekTime = (progressBar.value / 100) * audioPlayer.duration;
            if (!isNaN(seekTime)) {
                audioPlayer.currentTime = seekTime;
            }
        });


        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? "0" + sec : sec}`;
        }
    }


    preBtn.addEventListener("click", () => {
        if (currSongIndex > 0) {
            allSongs[currSongIndex - 1].querySelector(".hover-play-btn").click();
        }
    });
    nextBtn.addEventListener("click", () => {
        if (currSongIndex < allSongs.length - 1) {
            allSongs[currSongIndex + 1].querySelector(".hover-play-btn").click();
        }
    });

    audioPlayer.addEventListener("ended", () => {
        PlayPauseBtn.classList.remove("bi-pause-circle-fill");
        PlayPauseBtn.classList.add("bi-play-circle-fill");
    });


    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("email");

        loginBtn.style.display = "block";
        signBtn.style.display = "block";
        logoutBtn.style.display = "none";
        playerBox.style.display = "none";
        location.reload();
        alert("Logged out!");
    });

});







