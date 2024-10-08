let currentExerciseWeekOffset = 0;
let exerciseChart = null;

function recordExercise() {
    const date = document.getElementById('date').value;
    const calories = document.getElementById('calories').value;

    if (date && calories) {
        const exerciseData = {
            date: date,
            calories: calories
        };
        saveExerciseData(exerciseData);
    } else {
        document.getElementById('message').innerHTML = "未入力の項目があります。";
    }
}

function saveExerciseData(data) {
    let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    const existingIndex = exercises.findIndex(exercise => exercise.date === data.date);

    if (existingIndex !== -1) {
        exercises[existingIndex] = data;
    } else {
        exercises.push(data);
    }

    localStorage.setItem('exercises', JSON.stringify(exercises));
    document.getElementById('message').innerHTML = '入力情報が保存されました。';
    document.getElementById('back-button').style.display = "block";
}

function showExerciseRecords() {
    currentExerciseWeekOffset = 0;
    fetchExerciseWeekData(currentExerciseWeekOffset);
    document.getElementById('previous').style.display = "inline";
    document.getElementById('next').style.display = "inline";
}

function fetchExerciseWeekData(weekOffset) {
    let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
    if (exercises.length === 0) {
        document.getElementById('message').innerHTML = "記録がありません。";
        document.getElementById('exercise-chart').style.display = "none";
        return false;
    }

    exercises.sort((a, b) => new Date(a.date) - new Date(b.date));
    const start = weekOffset * 7;
    const end = start + 7;
    const exercisesToDisplay = exercises.slice(start, end);

    if (exercisesToDisplay.length === 0) {
        document.getElementById('message').innerHTML = "記録がありません。";
        document.getElementById('exercise-chart').style.display = "none";
        return false;
    }

    document.getElementById('message').innerHTML = "";
    document.getElementById('exercise-chart').style.display = "block";

    const labels = exercisesToDisplay.map(exercise => exercise.date);
    const caloriesData = exercisesToDisplay.map(exercise => exercise.calories);

    const ctx = document.getElementById('exercise-chart').getContext('2d');

    if (exerciseChart) {
        exerciseChart.destroy();
    }

    exerciseChart = new Chart(ctx, {
        type: 'line',  // 折れ線グラフに変更
        data: {
            labels: labels,
            datasets: [{
                label: '運動量',
                data: caloriesData,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                fill: false  // 折れ線グラフの下を塗りつぶさない
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    return true;
}

function changeExerciseWeek(direction) {
    currentExerciseWeekOffset += direction;
    fetchExerciseWeekData(currentExerciseWeekOffset).then((dataExists) => {
        if (!dataExists) {
            currentExerciseWeekOffset -= direction;
        }
    });
}

function goBack() {
    document.getElementById('message').innerHTML = "";
    document.getElementById('back-button').style.display = "none";
    document.getElementById('exercise-chart').style.display = "none";
    document.getElementById('previous').style.display = "none";
    document.getElementById('next').style.display = "none";
    currentExerciseWeekOffset = 0;
}
