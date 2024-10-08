function bmi_check(bmi) {
    let flag = 0;
    if (bmi < 18.5) {
        document.writeln("痩せすぎです");
        flag = 1;
    }
    else if (bmi <= 22) {
        document.writeln("標準体型です");
    }
    else if (bmi < 25) {
        document.writeln("正常です");

    }
    else if (bmi >= 25) {
        document.writeln("肥満です");
        flag = 1;

    }
    if (flag == 1) {
        document.writeln("bmiが22になることを目指しましょう!");
    }
    else {
        document.writeln("その調子で健康を維持しましょう!");
    }
}