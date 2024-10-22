// Constructor function for question objects.
function Question(question, questionCategory, responseOptions, responseOptionScores) {
    this.question = question;                   // string
    this.questionCategory = questionCategory;   // string
    this.responseOptions = responseOptions;     // array of strings
    this.responseOptionScores = responseOptionScores;   // array of numbers
    this.userResponse;                          // index in responseOptions
}

// Function to display one question on webpage.
function askQuestion(questionObject) {
    // Clear page.
    let bannerEl = document.getElementById("banner-image");
    bannerEl.innerText = "";
    let mainEl = document.getElementsByTagName("main")[0];
    mainEl.innerText = "";

    // Add question title to page.
    let questionTitle = document.createElement("h1");
    for (let i = 0; i < questionObjects.length; i++) {
        if (questionObjects[i].question == questionObject.question) {
            questionTitle.innerText = `Question ${i + 1} of ${questionObjects.length}`;
            break;
        }
    }
    mainEl.appendChild(questionTitle);

    // Display question on page.
    let questionEl = document.createElement("p");
    questionEl.innerText = questionObject.question;
    questionEl.setAttribute("id", "question");
    mainEl.appendChild(questionEl);

    // Display answer choices on page.
    let answersEl = document.createElement("ul");
    for (i = 0; i < questionObject.responseOptions.length; i++) {
        let answerEl = document.createElement("li");
        answerEl.innerText = questionObject.responseOptions[i];
        answersEl.appendChild(answerEl);
    }
    mainEl.appendChild(answersEl);

    document.getElementsByTagName("ul")[0].addEventListener("click", handleResponse);   // Wait for user to click their response choice.
}

// Function to handle user response (click).
function handleResponse(event) {
    let elementClicked = event.target; // returns the list element "<li>3</li>" that was clicked on
    
    // Record user selection.
    for (i = 0; i < questionObjects.length; i++) {
        if (document.getElementsByTagName("p")[0].innerText == questionObjects[i].question) {
            questionObjects[i].userResponse = Array.from(elementClicked.parentNode.children).indexOf(elementClicked);
            break;
        }
    }
    // Ask next question if there are more questions. Otherwise, get results.
    if (questionsAlreadyAsked.length == questionObjects.length) {
        document.getElementsByTagName("ul")[0].removeEventListener("click", handleResponse);
        getResults();
    } else {
        askNextQuestion();
    }
}

// Shows the next question on the page.
function askNextQuestion() {
    // Ask all the questions in questionObjects. Do not ask repeat questions.
    for (let i = 0; i < questionObjects.length; i++) {
        // if questoinObjects[i] is in questionsAlreadyAsked, go to next questionObject
        if (questionsAlreadyAsked.includes(questionObjects[i])) {
            // do nothing, go to next question.
        } else {
            questionsAlreadyAsked.push(questionObjects[i]); // Keep track of which questions the user has been asked.
            askQuestion(questionObjects[i]);
            break;
        }
    }
}
 
// Calculates results of user responses into format results chart can use.
function getResults() {
    // Object to store category scores
    let categoryScores = {};
    
    // Initialize categories with a score of 0
    for (let i = 0; i < questionObjects.length; i++) {
        let category = questionObjects[i].questionCategory;
        if (!categoryScores[category]) {
            categoryScores[category] = 0;
        }
    }

    // Calculate the total score for each category
    for (let i = 0; i < questionObjects.length; i++) {
        let category = questionObjects[i].questionCategory;
        let userScore = questionObjects[i].responseOptionScores[questionObjects[i].userResponse];
        categoryScores[category] += userScore;
    }

    // Display category-wise scores and the chart
    showCategoryWiseResults(categoryScores);
}

// Displays results chart and mental health descriptions.
function showCategoryWiseResults(categoryScores) {
    let mainEl = document.getElementsByTagName("main")[0];
    mainEl.innerText = "";  // Clear the page content

    // Add title to page
    let titleEl = document.createElement("h1");
    titleEl.innerText = "Questionnaire Results";
    titleEl.setAttribute("id", "results-h1");
    mainEl.appendChild(titleEl);

    // Create a section to display category-wise scores
let resultsDiv = document.createElement("div");
resultsDiv.setAttribute("class", "category-scores");
mainEl.appendChild(resultsDiv);

// Create another div for the first half of the category scores
let resultsDiv1 = document.createElement("div");
resultsDiv1.setAttribute("class", "category-scores1");
resultsDiv.appendChild(resultsDiv1);

// Create another div for the second half of the category scores
let resultsDiv2 = document.createElement("div");
resultsDiv2.setAttribute("class", "category-scores2"); // Different class for the second half
resultsDiv.appendChild(resultsDiv2);

// Get the category keys and split them into two halves
let categoryKeys = Object.keys(categoryScores);
let halfLength = Math.ceil(categoryKeys.length / 2);

// First half of the categories
for (let i = 0; i < halfLength; i++) {
    let category = categoryKeys[i];
    let categoryScoreEl = document.createElement("h5");
    categoryScoreEl.innerText = `${category}: ${categoryScores[category].toFixed(2)}%`;
    resultsDiv1.appendChild(categoryScoreEl); // Append the first half to resultsDiv1
}

// Second half of the categories
for (let i = halfLength; i < categoryKeys.length; i++) {
    let category = categoryKeys[i];
    let categoryScoreEl = document.createElement("h5");
    categoryScoreEl.innerText = `${category}: ${categoryScores[category].toFixed(2)}%`;
    resultsDiv2.appendChild(categoryScoreEl); // Append the second half to resultsDiv2
}

    resultsDiv.style.display = 'flex';
    resultsDiv.style.justifyContent = 'space-between';
    resultsDiv.style.alignItems = 'center';
    resultsDiv.style.width = '100%';
    resultsDiv.style.gap = '3vw';
    

function predictMood(depression, generalAnxiety, socialAnxiety, adhd, genderDysphoria, ptsd) {
    // Create a section to display category-wise scores
    // let resultsDiv = document.createElement("div");
    // resultsDiv.setAttribute("class", "category-scores");
    // document.body.appendChild(resultsDiv);

    // Define the categories and percentages
    const categories = [
        { name: 'Depression', score: depression, weight: 2 },
        { name: 'General Anxiety', score: generalAnxiety, weight: 1.5 },
        { name: 'Social Anxiety', score: socialAnxiety, weight: 1 },
        { name: 'ADHD', score: adhd, weight: 1 },
        { name: 'Gender Dysphoria', score: genderDysphoria, weight: 1 },
        { name: 'PTSD', score: ptsd, weight: 1.5 }
    ];

    // Display each category and its score
    // categories.forEach(category => {
    //     let categoryScoreEl = document.createElement("h5");
    //     categoryScoreEl.innerText = `${category.name}: ${category.score.toFixed(2)}%`;
    //     resultsDiv.appendChild(categoryScoreEl);
    // });

    // Mood prediction logic based on weighted scores
    let totalWeightedScore = 0;
    let totalWeight = 0;

    // Calculate the weighted total score
    categories.forEach(category => {
        totalWeightedScore += category.score * category.weight;
        totalWeight += category.weight;
    });

    // Calculate average weighted score
    let averageWeightedScore = totalWeightedScore / totalWeight;

    // Define thresholds based on weighted scores and assign mood
    let mood;
    if (depression >= 30 || generalAnxiety >= 15 || ptsd >= 15) {
        mood = "Low Mood (High Risk of Depression/Anxiety)";
    } else if (averageWeightedScore >= 70) {
        mood = "Low Mood (High Risk)";
    } else if (averageWeightedScore < 20) {
        mood = "Good Mood (Low Risk)";
    } else {
        mood = "Neutral Mood (Watchfulness Recommended)";
    }

    // Display the predicted mood
    let moodEl = document.createElement("h3");
    moodEl.innerText = `Predicted Mood: ${mood}`;
    resultsDiv.appendChild(moodEl);

    moodEl.style.border = "2px solid green";
    moodEl.style.background = 'linear-gradient(135deg, #bcf1a1, #f0f0f0)';
    moodEl.style.padding = "1vw";

    // Suggestions based on the predicted mood
    let suggestionsEl = document.createElement("div");
    suggestionsEl.setAttribute("class", "mood-suggestions");
    resultsDiv.appendChild(suggestionsEl);

    switch (mood) {
        case "Low Mood (High Risk of Depression/Anxiety)":
            suggestionsEl.innerHTML = `
                <h4>Suggestions:</h4>
                <ul>
                    <li>Consider talking to a mental health professional for support.</li>
                    <li>Engage in regular physical activity, which can boost your mood.</li>
                    <li>Practice mindfulness or meditation to help manage anxiety.</li>
                </ul>`;
            break;

        case "Low Mood (High Risk)":
            suggestionsEl.innerHTML = `
                <h4>Suggestions:</h4>
                <ul>
                    <li>Connect with friends or family for support and companionship.</li>
                    <li>Try journaling to express your feelings and thoughts.</li>
                    <li>Explore relaxation techniques, such as deep breathing exercises.</li>
                </ul>`;
            break;

        case "Neutral Mood (Watchfulness Recommended)":
            suggestionsEl.innerHTML = `
                <h4>Suggestions:</h4>
                <ul>
                    <li>Stay engaged in activities you enjoy and find fulfilling.</li>
                    <li>Consider setting small, achievable goals to boost motivation.</li>
                    <li>Practice self-care routines to maintain your well-being.</li>
                </ul>`;
            break;

        case "Good Mood (Low Risk)":
            suggestionsEl.innerHTML = `
                <h4>Suggestions:</h4>
                <ul>
                    <li>Continue practicing positive habits and routines.</li>
                    <li>Share your positivity with others, as it can enhance social connections.</li>
                    <li>Stay aware of your mental health and continue self-reflection.</li>
                </ul>`;
            break;

        default:
            suggestionsEl.innerHTML = `
                <h4>Suggestions:</h4>
                <ul>
                    <li>Stay proactive about your mental health.</li>
                    <li>Regularly assess how you’re feeling and adjust self-care practices accordingly.</li>
                </ul>`;
            break;
    }
}

// Example usage
predictMood(3, 2, 8, 1, 5, 1);  // Pass the percentage scores for each category

    
    // predictMood(categoryScores[0], categoryScores[1], categoryScores[2], categoryScores[3], categoryScores[4], categoryScores[5]);




    
    // Add canvas for chart
    let canvasContainer = document.createElement("div");
    canvasContainer.setAttribute("class", "chart-divs");
    mainEl.appendChild(canvasContainer);

    // Create canvas element for the chart
    let canvasEl = document.createElement("canvas");
    canvasContainer.appendChild(canvasEl);
    let ctx = canvasEl.getContext("2d");

    // Create chart
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categoryScores),
            datasets: [{
                label: 'Score',
                data: Object.values(categoryScores),
                backgroundColor: 'rgb(18, 99, 21)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '% of Maximum Possible Score'
                    }
                }
            },
        }
    });

    // Add mental health descriptions as before
    addConditionDescriptions(mainEl);
}

// Adds condition descriptions
function addConditionDescriptions(mainEl) {
    let descriptionObjects = {
        conditions: ['Depression','Generalized Anxiety','Social Anxiety','ADHD','Gender Dysphoria','PTSD'],
        links: [
            'https://www.nimh.nih.gov/health/topics/depression',
            'https://www.nimh.nih.gov/health/publications/generalized-anxiety-disorder-gad',
            'https://www.nimh.nih.gov/health/statistics/social-anxiety-disorder',
            'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
            'https://en.wikipedia.org/wiki/Gender_dysphoria',
            'https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd'
        ],
        descriptions: [
            `Depression (major depressive disorder or clinical depression) is a common but serious mood disorder. It causes severe symptoms that affect how you feel, think, and handle daily activities, such as sleeping, eating, or working.`,
            `Occasional anxiety is a normal part of life. You might worry about things like health, money, or family problems. But people with generalized anxiety disorder (GAD) feel extremely worried or feel nervous about these and other things—even when there is little or no reason to worry about them. People with GAD find it difficult to control their anxiety and stay focused on daily tasks.`,
            `Social anxiety disorder (formerly social phobia) is characterized by persistent fear of one or more social or performance situations in which the person is exposed to unfamiliar people or to possible scrutiny by others. The individual fears that he or she will act in a way (or show anxiety symptoms) that will be embarrassing and humiliating.`,
            `Attention-deficit/hyperactivity disorder (ADHD) is marked by an ongoing pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning or development.`,
            `Gender dysphoria (GD) is the distress a person feels due to a mismatch between their gender identity—their personal sense of their own gender—and their sex assigned at birth.`,
            `Post-traumatic stress disorder (PTSD) is a disorder that develops in some people who have experienced a shocking, scary, or dangerous event. It is natural to feel afraid during and after a traumatic situation. Fear triggers many split-second changes in the body to help defend against danger or to avoid it.`
        ],
        source: [
            'National Institute of Mental Health',
            'National Institute of Mental Health',
            'National Institute of Mental Health',
            'National Institute of Mental Health',
            'Wikipedia',
            'National Institute of Mental Health'
        ]
    };

    let figureContainer = document.createElement("div");
    figureContainer.setAttribute("id", "figure-container");

    for (let i = 0; i < descriptionObjects.conditions.length; i++) {
        let definitionFig = document.createElement("figure");
        figureContainer.appendChild(definitionFig);
    
        let link = document.createElement("figcaption");
        link.innerText = descriptionObjects.conditions[i];
        definitionFig.appendChild(link);
    
        let quote = document.createElement("blockquote");
        quote.innerText = descriptionObjects.descriptions[i];
        definitionFig.appendChild(quote);
    
        let source = document.createElement("a");
        source.innerText = descriptionObjects.source[i];
        source.href = descriptionObjects.links[i];
        definitionFig.appendChild(source);
    }

    mainEl.appendChild(figureContainer);
}

// Question bank and associated arrays to build question objects out of.
QuestionCategory = [
    'Depression',
    'Depression',
    'Depression',
    'Generalized Anxiety',
    'Generalized Anxiety',
    'Generalized Anxiety',
    'Social Anxiety', 
    'Social Anxiety',
    'Social Anxiety',
    'ADHD',
    'ADHD',
    'ADHD',
    'Gender Dysphoria',
    'Gender Dysphoria',
    'Gender Dysphoria',
    'PTSD',
    'PTSD',
    'PTSD'
];

Questions = [
    'How often do you feel little interest or pleasure in doing things you used to enjoy?',
    'How often do you feel hopeless about the future?',
    'How often do you feel down, depressed, or sad for no apparent reason?',
    'How often do you feel nervous, anxious, or on edge?',
    'How often do you worry about different things, even when there’s no apparent reason?',
    'How often do you find it hard to stop or control worrying?',
    'How often do you avoid social situations because you fear being judged or embarrassed?',
    'How often do you worry about saying or doing something awkward in front of others?',
    'How often do you feel intense fear or discomfort in social gatherings or when meeting new people?',
    'How often do you find it difficult to focus on tasks or conversations for long periods of time?',
    'How often do you fidget or move around when you’re supposed to be sitting still?',
    'How often do you feel overly active, like you’re driven by a motor and can’t relax?',
    'How often do you feel uncomfortable with your body or physical characteristics because they do not align with your gender identity?',
    'How often do you feel distressed or upset when others misgender you or use incorrect pronouns?',
    'How often do you wish you were born as a different gender?',
    'How often do you experience distressing memories or flashbacks of a past traumatic event?',
    'How often do you feel emotionally numb or detached from others after experiencing trauma?',
    'How often do you feel anxious or on edge, as if you are constantly in danger or unable to relax?'
];

ResponseOptions = [
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always'],
   ['Never', 'Occasionally', 'Often', 'Very often', 'Always']
];

ScoringKey = [
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44],
    [0, 11.11, 22.22, 33.33, 44.44]   
];

let questionObjects = [];

for (let i = 0; i < Questions.length; i++) {
    let tempObj = new Question(Questions[i], QuestionCategory[i], ResponseOptions[i], ScoringKey[i]);
    questionObjects.push(tempObj);
}

// Keep track of which questions have already been asked.
let questionsAlreadyAsked = [];
document.getElementById("yes").addEventListener("click", askNextQuestion);
