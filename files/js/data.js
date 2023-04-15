/*==========================================================================================================================================================================*/
/* Quiz */
const quizData = [
    {
        question: 1,
        title: "Какой сайт нужен?",
        questionName: "type-site",
        progress: "0%",
        answers: [
            {
                image: "img/quiz/question-1/option-1.png",
                answerTitle: "Одностраничный",
                type: "radio",
                typeBathrobe: "одностраничный",
            },
            {
                image: "img/quiz/question-1/option-2.png",
                answerTitle: "Многостраничный",
                type: "radio",
                typeBathrobe: "многостраничный",
            },
            {
                image: "img/quiz/question-1/option-3.png",
                answerTitle: "Интернет магазин",
                type: "radio",
                typeBathrobe: "интернет-магазин",
            },
            {
                image: "img/quiz/question-1/option-4.png",
                answerTitle: "Не определен",
                type: "radio",
                typeBathrobe: "Не определен",
            }
        ]
    },
    {
        question: 2,
        title: "Расскажите о своем проекте",
        questionName: "project",
        progress: "33.3333%",
        answers: [
            {
                answerTitle: "Например: Мы производим и продаём сантехнику оптом",
                type: "message"
            },
        ]
    },
    {
        question: 3,
        title: "Когда планируете запустить сайт?",
        questionName: "start-time",
        progress: "66.6666%",
        answers: [
            {
                answerTitle: "Срочная разработка",
                type: "radio"
            },
            {
                answerTitle: "В течение месяца",
                type: "radio"
            },
            {
                answerTitle: "Через 2-3 месяца",
                type: "radio"
            },
            {
                answerTitle: "Свой вариант",
                answerInput: "Введите свой вариант",
                type: "radio"
            },
        ]
    },
    {
        question: 4,
        title: "Мы уже начали готовить расчёт для вас",
        text: "Заполните контактные данные для того, чтобы я вам отправил персональное предложение",
        questionName: "contacts",
        answers: [
            {
                answerTitle: "Ваше имя",
                type: "text"
            },
            {
                answerTitle: "Ваш телефон",
                type: "tel"
            },
        ]
    }
];