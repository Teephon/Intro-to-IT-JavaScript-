var answerOptionsNum = 4;
var checkboxIndex = 0;
var questionNum = 0;
var questionIndex = 0;
var allowedChars = createAllowedChars();
var userAnswers = [];
// an object for containing the test itself: questions, answer options, correct answers
var test = new Object();

var defaultTest = {
    question_1: ['Что из перечисленного не является языком программирования?',
                    'HTML', 'Java', 'Python', 'DevOps',
                    '1,4'],
    question_2: ['Какие из перечисленных видов тестирования могут быть автоматизированы?',
                    'UI тестирование', 'Юзабилити тестирование', 'Тестирование совместимости', 'Unit тестирование',
                    '1,3,4'],
    question_3: ['Выберите типы алгоритмов, которых не существует',
                    'Алгоритмы с ветвлением', 'Циклический безусловный', 'Циклический с параметром', 'Алгоритм с углублением',
                    '2,4'],
    question_4: ['Какая (какие) из следующих конструкций используется (используются) для ветвления?',
                    'switch case', 'if else', 'do while', 'for',
                     '1,2'],
    question_5: ['Какого (каких) метода (методов) тестирования не существует?',
                    'Метод белого ящика', 'Метод "игры в ящик"', 'Метод "кротовой норы"', 'Метод серого ящика',
                    '2,3'],
}

// create and show final notification with the test result
function resultNotification(wrongAnswersArr) {
    var notificationText = '';
    if (wrongAnswersArr.length === 0) {
        notificationText = `Ваш результат ${questionNum} из ${questionNum}. Вы молодец!\n`;
    }else{
        notificationText = `Вы неправильно ответили на вопросы:\n`;
        for (var index = 0; index < wrongAnswersArr.length; index++) {
            var answerNum = wrongAnswersArr[index];
            notificationText +=`\n ${answerNum}. ${test[`question_${answerNum}`][0]}`;
        }
        notificationText += `\n
        Ваш результат ${questionNum - wrongAnswersArr.length} из ${questionNum}`;
    }
    alert(notificationText);
}

function verifyAnswers(arr) {
    var wrongAnswers = [];
    for (var index = 0; index < arr.length; index++) {
        var userAnswerFormatted = arr[index].split(',').join('');
        var correctAnswer = test[`question_${index+1}`].pop(); // the last element in the question_# array is the right answer
        var correctAnswerFormatted = correctAnswer.split(',').sort().join('');
        if (userAnswerFormatted !== correctAnswerFormatted) {
            wrongAnswers.push(index+1);
        }
    }
    resultNotification(wrongAnswers);
}

function formatAnswers(str) {
    var noSpaces = str.split(' ').join('');
    var answersFormatted = noSpaces.split('.');
    answersFormatted.pop();
    return answersFormatted;
}

// check is there user's answer on each question
function answersControl(answersFormatted) {
    var isThereAnswer = true;
    for (var index = 0; index < answersFormatted.length; index++) {
        if (answersFormatted[index] === ',,,'){
            alert("Все вопросы должны иметь хотя бы один выбранный вариант вариант ответа. Проверьте правильность заполнения");
            isThereAnswer = false;
            break;
        }
    }
    if (isThereAnswer) verifyAnswers(answersFormatted);
}

//getting all of user's answers from checkboxes, split by '.' in groups according to answerOptionsNum
function getUserAnswers() {
    userAnswers = document.getElementsByClassName("checkboxes");
    var userAnswersStr = '';
    for (var index = 0; index < userAnswers.length; index++) {
            if (userAnswers.item(index).checked) {
                var answerOption = (index % answerOptionsNum) + 1;
                if ((index + 1) % answerOptionsNum !== 0) {
                    userAnswersStr += answerOption + ',';
                }else{
                    userAnswersStr += answerOption + '.';
                }
            }else{
                if ((index + 1) % answerOptionsNum !== 0) {
                    userAnswersStr += ' ,';
                }else{
                    userAnswersStr += ' .';
                }
            }
        }
    var answersFormatted = formatAnswers(userAnswersStr);
    answersControl(answersFormatted);
    //if (answersControl(answersFormatted)) verifyAnswers(answersFormatted);
}

function checkTest() {
    getUserAnswers();
}

function createSubmitBtn() {
    var br = document.createElement("br");
    var submitBtn = document.createElement('input');
    submitBtn.type = "button";
    submitBtn.value = 'Отправить';
    submitBtn.addEventListener("click", checkTest);
    submitBtn.style = "margin-left: 40px";
    document.body.append(br);
    document.body.append(submitBtn);
}

function createCheckbox() {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.style = "margin-left: 40px";
    checkbox.className = "checkboxes";
    checkboxIndex++;
    checkbox.value = `checkbox${checkboxIndex}`;
    document.body.append(checkbox);
}

function showAnswerOptions(question) {
    for (var i = 1; i <= 4; i++) {
        var br = document.createElement("br");
        var optionText = document.createTextNode(' ' + question[i]);
        createCheckbox();
        document.body.append(optionText);
        document.body.append(br);
    }
}
//var br = document.createElement("br");
//document.body.append(br);

function showQuestion(question) {
    var questionDiv = document.createElement('div');
    questionDiv.innerHTML = `<p style="margin-left: 20px"><strong>${++questionNum}. ${question[0]}</strong></p>`;
    document.body.append(questionDiv);
    showAnswerOptions(question);
}

function disableButtons() {
    var questionBtn = document.getElementById("questionBtn");
    questionBtn.setAttribute("disabled", "disabled");
    var startTestBtn = document.getElementById("startTestBtn");
    startTestBtn.setAttribute("disabled", "disabled");
}

function showTest(test) {
    disableButtons();
    for (var question in test) {
        showQuestion(test[question]);
    }
    createSubmitBtn();
}

//checking for user added questions, if there is none, using defaultTest
function isUserQuestion() {
    if (!("question_1" in test)) test = defaultTest;
}

function beginTest() {
    isUserQuestion();
    showTest(test);
}

function isThereInput(input) {
    return (input !== null && input !== '');
}

function addQuestion(input, number) {
    var question = 'question_' + number;
    test[question] = [input];
    addAnswerOption(question);
}

// create a string of answer option numbers to check user's input and using it in notification
function createAllowedChars() {
    var str = '';
    for (var i = 1; i < answerOptionsNum; i++) {
        str += (i + ', ');
    }
    return str + answerOptionsNum;
}

function isUnique(input) {
    var inputOptions = input.split(',').join('');
    return new Set(inputOptions).size === inputOptions.length;
}

function isAllowedChar(input) {
    var isAllowed = true;
    for (var inputElement of input) {
        isAllowed = allowedChars.includes(inputElement);
        if (!isAllowed) break;
    }
    return isAllowed;
}

//get and save correct answer from user's input
function setCorrectAnswer(questionNum) {
    var correctAnswer = prompt('Введите номера правильных ответов через запятую. Нумерация начинается с 1');
    var correctAnswerFormatted = correctAnswer.split(" ").join("");
    if (isAllowedChar(correctAnswerFormatted) && isUnique(correctAnswerFormatted)) {
        test[questionNum].push(correctAnswerFormatted);
    } else {
        alert('Поле может содержать только уникальные цифры ' + allowedChars + ', разделенные запятой, попробуйте добавить вопрос заново');
    }
}

function addAnswerOption(questionNum) {
    for (var i = 1; i <= answerOptionsNum; i++) {
        var answerOption = prompt('Введите текст ' + i + ' варианта ответа');
        if (isThereInput(answerOption)) {
            test[questionNum].push(answerOption);
            if (i === answerOptionsNum) setCorrectAnswer(questionNum);
        } else {
            alert('Вы не ввели текст ' + i + ' варианта ответа. Попробуйте добавить вопрос заново');
            break;
        }
    }
}

function createQuestion() {
    var questionText = prompt('Введите текст вопроса:');
    if (isThereInput(questionText)){
        questionIndex++;
        addQuestion(questionText, questionIndex);
    } else {
        alert('Вы не ввели текст вопроса. Попробуйте добавить вопрос заново');
    }
}