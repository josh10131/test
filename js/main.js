var globalQuestions = []; // 用於存儲最終選取的題目

$(document).ready(function () {
    $.getJSON('questions.json', function (data) {
        let choiceQuestions = data.filter(q => q.type === "choice");
        let trueFalseQuestions = data.filter(q => q.type === "true_false");

        // 從各自類型中隨機選取指定數量的題目
        let selectedChoiceQuestions = shuffleArray(choiceQuestions).slice(0, 30);
        let selectedTrueFalseQuestions = shuffleArray(trueFalseQuestions).slice(0, 20);

        // 合併選取的題目並存儲
        globalQuestions = selectedChoiceQuestions.concat(selectedTrueFalseQuestions);
        displayQuestions(globalQuestions);
    });

    $('#submit').click(function () {
        checkAnswers();
    });
    $('#restart').click(function () {
        // 重新載入題目
        reloadQuestions();

        // 隱藏重新開始按鈕
        $(this).hide();

        // 啟用單選按鈕
        $('input[type="radio"]').prop('disabled', false);

        // 清空先前的選擇和結果
        $('input[type="radio"]').prop('checked', false);
        $('#result').html('');
        $('.correct-answer').remove(); // 移除正確答案提示
        $('.question').removeClass('correct incorrect'); // 移除答對答錯的樣式
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayQuestions(questions) {
    questions.forEach(function (q, index) {
        let questionHtml = `<li class="question">
            <h5>${q.question}</h5>` +
            q.choices.map((choice, i) =>
                `<div class="form-check">
                    <input class="form-check-input" type="radio" name="question${q.id}" id="inlineRadio${q.id}-${i}" value="${choice}">
                    <label class="form-check-label" for="inlineRadio${q.id}-${i}">${choice}</label>
                </div>`
            ).join('') +
            `</li>`;
        $('#quiz-container').append(questionHtml);
    });
}

function checkAnswers() {
    let correct = 0;
    $('.question').each(function () { // 迭代每個問題
        let questionId = $(this).find('input[type="radio"]').attr('name').replace('question', '');
        let userAnswer = $(this).find('input[type="radio"]:checked').val();
        let question = globalQuestions.find(q => q.id.toString() === questionId);

        if (question && question.answer === userAnswer) {
            correct++;
            $(this).addClass('correct').removeClass('incorrect'); // 答對題目
        } else {
            $(this).addClass('incorrect').removeClass('correct'); // 答錯題目
            // 如果需要在答錯的題目下方顯示正確答案
            $(this).find('.correct-answer').remove(); // 移除先前的正確答案提示（如果有）
            $(this).append(`<div class="correct-answer">正確答案：( ${question.answer} )</div>`);
        }
    });

    let score = correct * 2; // 每題2分
    $('#result').html(`你的分數是 ${score} / ${globalQuestions.length * 2}。`);

    $('input[type="radio"]').prop('disabled', true);

    // 顯示重新開始按鈕
    $('#restart').show();
}

function reloadQuestions() {
    $('#quiz-container').empty(); // 清空現有的題目
    // 重新載入題目的邏輯（可以重用之前加載題目的代碼）
    $.getJSON('questions.json', function (data) {
        let choiceQuestions = data.filter(q => q.type === "choice");
        let trueFalseQuestions = data.filter(q => q.type === "true_false");

        let selectedChoiceQuestions = shuffleArray(choiceQuestions).slice(0, 30);
        let selectedTrueFalseQuestions = shuffleArray(trueFalseQuestions).slice(0, 20);

        globalQuestions = selectedChoiceQuestions.concat(selectedTrueFalseQuestions);
        displayQuestions(globalQuestions);
    });
}

