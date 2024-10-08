let currentWeekOffset = 0;
let sleepChart = null;

function recordSleep() {
    const date = document.getElementById('date').value;
    const wakeUpTime = document.getElementById('wakeUpTime').value;
    const bedTime = document.getElementById('bedTime').value;

    if (date && wakeUpTime && bedTime) {
        const sleepData = {
            date: date,
            wakeUpTime: wakeUpTime,
            bedTime: bedTime,
        };
        saveSleepData(sleepData);
    } else {
        document.getElementById('message').innerHTML = "未入力の項目があります。";
    }
}

function saveSleepData(data) {
    let sleepRecords = JSON.parse(localStorage.getItem('sleepRecords')) || [];
    const existingIndex = sleepRecords.findIndex(record => record.date === data.date);

    if (existingIndex !== -1) {
        sleepRecords[existingIndex] = data;
    } else {
        sleepRecords.push(data);
    }

    localStorage.setItem('sleepRecords', JSON.stringify(sleepRecords));
    document.getElementById('message').innerHTML = '入力情報が保存されました。';
    document.getElementById('back-button').style.display = "block";
}

function showPastRecords() {
    currentWeekOffset = 0;
    fetchWeekData(currentWeekOffset);
    document.getElementById('previous').style.display = "inline";
    document.getElementById('next').style.display = "inline";
}

function fetchWeekData(weekOffset) {
    let sleepRecords = JSON.parse(localStorage.getItem('sleepRecords')) || [];
    if (sleepRecords.length === 0) {
        document.getElementById('message').innerHTML = "記録がありません。";
        document.getElementById('sleep-chart').style.display = "none";
        document.getElementById('sleep-table').style.display = "none";
        return false;
    }

    sleepRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
    const start = weekOffset * 7;
    const end = start + 7;
    const sleepDataToDisplay = sleepRecords.slice(start, end);

    if (sleepDataToDisplay.length === 0) {
        document.getElementById('message').innerHTML = "記録がありません。";
        document.getElementById('sleep-chart').style.display = "none";
        document.getElementById('sleep-table').style.display = "none";
        return false;
    }

    document.getElementById('message').innerHTML = "";
    document.getElementById('sleep-chart').style.display = "block";
    document.getElementById('sleep-table').style.display = "table";

    const labels = sleepDataToDisplay.map(sleep => sleep.date);
    const sleepTimeData = sleepDataToDisplay.map(sleep => calculateSleepDuration(sleep.bedTime, sleep.wakeUpTime));

    const ctx = document.getElementById('sleep-chart').getContext('2d');

    if (sleepChart) {
        sleepChart.destroy();
    }

    sleepChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '睡眠時間 (時間)',
                    data: sleepTimeData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
            ]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: false
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                }
            }
        }
    });

    const tableBody = document.getElementById('sleep-table').querySelector('tbody');
    tableBody.innerHTML = "";
    sleepDataToDisplay.forEach(sleep => {
        const row = tableBody.insertRow();
        row.insertCell().innerText = sleep.date;
        row.insertCell().innerText = sleep.wakeUpTime;
        row.insertCell().innerText = sleep.bedTime;
        row.insertCell().innerText = calculateSleepDuration(sleep.bedTime, sleep.wakeUpTime) + " 時間";
    });

    return true;
}

function calculateSleepDuration(bedTime, wakeUpTime) {
    const [bedHour, bedMinute] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeUpTime.split(':').map(Number);

    let sleepDuration = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
    if (sleepDuration < 0) {
        sleepDuration += 24 * 60; 
    }

    return (sleepDuration / 60).toFixed(2); 
}

function changeWeek(direction) {
    currentWeekOffset += direction;
    fetchWeekData(currentWeekOffset).then((dataExists) => {
        if (!dataExists) {
            currentWeekOffset -= direction;
        }
    });
}

function goBack() {
    document.getElementById('message').innerHTML = "";
    document.getElementById('back-button').style.display = "none";
    document.getElementById('sleep-chart').style.display = "none";
    document.getElementById('sleep-table').style.display = "none";
    document.getElementById('previous').style.display = "none";
    document.getElementById('next').style.display = "none";
    currentWeekOffset = 0;
}