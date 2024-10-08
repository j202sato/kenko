let currentWeekOffset = 0;
let mealChart = null;

function recordMeal() {
    const date = document.getElementById('date').value;
    const breakfast = document.getElementById('breakfast').value;
    const lunch = document.getElementById('lunch').value;
    const dinner = document.getElementById('dinner').value;

    if (date && breakfast && lunch && dinner) {
        const mealData = {
            date: date,
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner
        };
        saveMealData(mealData);
    } else {
        document.getElementById('message').innerHTML = "未入力の項目があります。";
    }
}

function saveMealData(data) {
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    const existingIndex = meals.findIndex(meal => meal.date === data.date);

    if (existingIndex !== -1) {
        // 同じ日付の記録が存在する場合、上書きする
        meals[existingIndex] = data;
    } else {
        // 新しい記録を追加する
        meals.push(data);
    }

    localStorage.setItem('meals', JSON.stringify(meals));
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
    let meals = JSON.parse(localStorage.getItem('meals')) || [];
    if (meals.length === 0) {
        document.getElementById('message').innerHTML = "記録がありません。";
        document.getElementById('meal-chart').style.display = "none";
        return false;
    }

    meals.sort((a, b) => new Date(a.date) - new Date(b.date));
    const start = weekOffset * 7;
    const end = start + 7;
    const mealsToDisplay = meals.slice(start, end);

    if (mealsToDisplay.length === 0) {
        document.getElementById('message').innerHTML = "記録がありません。";
        document.getElementById('meal-chart').style.display = "none";
        return false;
    }

    document.getElementById('message').innerHTML = "";
    document.getElementById('meal-chart').style.display = "block";

    const labels = mealsToDisplay.map(meal => meal.date);
    const breakfastData = mealsToDisplay.map(meal => meal.breakfast);
    const lunchData = mealsToDisplay.map(meal => meal.lunch);
    const dinnerData = mealsToDisplay.map(meal => meal.dinner);

    const ctx = document.getElementById('meal-chart').getContext('2d');

    if (mealChart) {
        mealChart.destroy();
    }

    mealChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '朝食量',
                    data: breakfastData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: '昼食量',
                    data: lunchData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: '夕食量',
                    data: dinnerData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
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
    document.getElementById('meal-chart').style.display = "none";
    document.getElementById('previous').style.display = "none";
    document.getElementById('next').style.display = "none";
    currentWeekOffset = 0;
}
