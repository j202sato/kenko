var correct_bgm = new Audio("決定ボタンを押す4.mp3");
var wrong_bgm = new Audio("キャンセル5.mp3");
var userflag = 0;
function play_bgm(flag) {
    if (flag == 0) {
        correct_bgm.play();
    }
    else {
        wrong_bgm.play();
    }
}
function set_volume(level) {
    // ボリューム設定のロジックをここに実装
    correct_bgm.volume = level;
    wrong_bgm.volume = level;
}

