// Roll history array
let rollHistory = [];

// Roll D100 dice
function rollDice() {
    const skillValue = parseInt(document.getElementById('skillValue').value) || 0;
    
    if (skillValue < 0 || skillValue > 100) {
        alert('技能值必须在 0-100 之间 (Skill value must be between 0-100)');
        return;
    }
    
    const roll = Math.floor(Math.random() * 100) + 1;
    displayResult(roll, skillValue, 'regular');
    addToHistory(roll, skillValue, 'regular');
}

// Roll with specific difficulty
function rollWithDifficulty(difficulty) {
    const skillValue = parseInt(document.getElementById('skillValue').value) || 0;
    
    if (skillValue < 0 || skillValue > 100) {
        alert('技能值必须在 0-100 之间 (Skill value must be between 0-100)');
        return;
    }
    
    const roll = Math.floor(Math.random() * 100) + 1;
    displayResult(roll, skillValue, difficulty);
    addToHistory(roll, skillValue, difficulty);
}

// Display the result
function displayResult(roll, skillValue, difficulty) {
    const resultDisplay = document.getElementById('resultDisplay');
    const resultNumber = resultDisplay.querySelector('.result-number');
    const resultText = document.getElementById('resultText');
    
    // Update the dice number
    resultNumber.textContent = roll;
    
    // Calculate threshold based on difficulty
    let threshold = skillValue;
    let difficultyName = '普通 (Regular)';
    
    if (difficulty === 'hard') {
        threshold = Math.floor(skillValue / 2);
        difficultyName = '困难 (Hard)';
    } else if (difficulty === 'extreme') {
        threshold = Math.floor(skillValue / 5);
        difficultyName = '极难 (Extreme)';
    }
    
    // Determine the result
    let resultMessage = '';
    let resultClass = '';
    
    // Critical success: roll is 1
    if (roll === 1) {
        resultMessage = `🎉 大成功! Critical Success! (${difficultyName})`;
        resultClass = 'critical-success';
    }
    // Critical failure: roll is 100
    else if (roll === 100) {
        resultMessage = `💀 大失败! Critical Failure! (${difficultyName})`;
        resultClass = 'critical-failure';
    }
    // Regular critical failure: roll 96-99 when skill is 50 or higher
    else if (roll >= 96 && skillValue >= 50) {
        resultMessage = `💀 大失败! Critical Failure! (${difficultyName})`;
        resultClass = 'critical-failure';
    }
    // Success
    else if (roll <= threshold) {
        resultMessage = `✅ 成功! Success! (${difficultyName}: ${threshold})`;
        resultClass = 'success';
    }
    // Failure
    else {
        resultMessage = `❌ 失败! Failure! (${difficultyName}: ${threshold})`;
        resultClass = 'failure';
    }
    
    // Update display
    resultText.textContent = resultMessage;
    resultText.className = 'result-text ' + resultClass;
    
    // Animate the roll
    animateRoll(resultNumber);
}

// Animate the dice roll
function animateRoll(element) {
    element.style.transform = 'scale(1.3) rotate(360deg)';
    element.style.transition = 'transform 0.5s ease-out';
    
    setTimeout(() => {
        element.style.transform = 'scale(1) rotate(0deg)';
    }, 500);
}

// Add roll to history
function addToHistory(roll, skillValue, difficulty) {
    const timestamp = new Date().toLocaleTimeString();
    
    let difficultyName = '普通';
    if (difficulty === 'hard') difficultyName = '困难';
    else if (difficulty === 'extreme') difficultyName = '极难';
    
    const historyItem = {
        roll,
        skillValue,
        difficulty: difficultyName,
        timestamp
    };
    
    rollHistory.unshift(historyItem);
    
    // Keep only last 10 rolls
    if (rollHistory.length > 10) {
        rollHistory.pop();
    }
    
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (rollHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; opacity: 0.6;">暂无历史记录 (No history yet)</div>';
        return;
    }
    
    historyList.innerHTML = rollHistory.map(item => `
        <div class="history-item">
            ${item.timestamp} - 掷出: <strong>${item.roll}</strong> | 技能: ${item.skillValue} | 难度: ${item.difficulty}
        </div>
    `).join('');
}

// Clear history
function clearHistory() {
    rollHistory = [];
    updateHistoryDisplay();
}

// Initialize display
updateHistoryDisplay();

// Allow Enter key to roll
document.getElementById('skillValue').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        rollDice();
    }
});
