let timerId;
let countdownTimer;

function startRefresh() {
    stopRefresh(); // 清除之前的定时器

    const intervalInput = document.getElementById('refreshInterval');
    let interval = parseInt(intervalInput.value, 10);

    if (isNaN(interval) || interval < 1) {
        alert('请输入有效的刷新间隔（大于等于1秒）');
        return;
    }

    interval *= 1000; // 转换为毫秒

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        timerId = setInterval(() => {
            chrome.tabs.reload(tabs[0].id);
        }, interval);
    });

    updateButtonStatus(true);
    startCountdown(interval);
}

function stopRefresh() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    updateButtonStatus(false);
    document.getElementById('countdown').textContent = '';
}

function updateButtonStatus(isRefreshing) {
    const startButton = document.getElementById('startRefresh');
    const stopButton = document.getElementById('stopRefresh');

    startButton.disabled = isRefreshing;
    stopButton.disabled = !isRefreshing;
}

function startCountdown(interval) {
    let remainingTime = interval / 1000;
    const countdownElement = document.getElementById('countdown');

    function updateCountdown() {
        countdownElement.textContent = `下次刷新倒计时：${remainingTime}秒`;
        remainingTime--;

        if (remainingTime < 0) {
            remainingTime = interval / 1000;
        }
    }

    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
}

document.getElementById('startRefresh').addEventListener('click', startRefresh);
document.getElementById('stopRefresh').addEventListener('click', stopRefresh);

// 初始化按钮状态
updateButtonStatus(false);
