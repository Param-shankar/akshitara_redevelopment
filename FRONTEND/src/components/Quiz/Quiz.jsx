import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineRestartAlt } from "react-icons/md";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Quiz.css";

const bodyQuestions = [
  {
    question: "What is your age?",
    options: ["0-20", "21-50", ">50"],
  },
  {
    question: "What is your gender?",
    options: ["Male", "Female", "Other"],
  },
  {
    question: "What is the type of your diet?",
    options: ["Vegetarian", "Non-vegetarian", "Eggetarian", "Mixed"],
  },
  {
    question: "Which region of India are you native to?",
    options: [
      "Southern India",
      "Northern India",
      "Western India",
      "Eastern India",
    ],
  },
  {
    question: "Which of these best describes your occupation?",
    options: [
      "White collar job (govt. Employee, teacher, Banker etc.)",
      "stressful job like (Student, Doctor, corporates, Call centres, It sector, Management, Driver etc.)",
      "Physically labor-intensive work",
    ],
  },
  {
    question:
      "Which of the following best describes your typical level of hunger?",
    options: [
      "Regular and sufficient",
      "Regular but excessive",
      "Irregular, varying each day",
    ],
  },
  {
    question: "Which of these best matches your usual eating pattern?",
    options: [
      "I eat 1-2 times a day with sufficient quantity, consistently",
      "I eat multiple times a day with sufficient quantity",
      "My eating pattern is irregular, sometimes less, sometimes excessive",
    ],
  },
  {
    question: "Which option best matches your usual sleeping pattern?",
    options: [
      "I sleep more than 8 hours a night with sound, regular sleep",
      "I get 6-7 hours of medium-quality sleep",
      "I sleep less than 6 hours, and my sleep is often disturbed or inconsistent",
    ],
  },
  {
    question:
      "Which of the following best describes your typical food preferences and types?",
    options: [
      "Spicy, Sour, Salty, Bitter Taste, hot and easily digestible food Fermented or boiled, cooked, 2-3 times a day",
      "Mostly Sweet, somewhat Astringent, bitter, cold, semi cooked, fat contained food, 4-5 tines a day",
      "Sweet, Sour, Salty, hot, fat containing food, boiled, cooked is preferred, number of meals vary",
    ],
  },
  {
    question:
      "Which of the following best describes your memory and learning style?",
    options: [
      "Good memory but slow at grasping new information",
      "Medium grasping ability, with strong presence of mind, problem-solving, and decision-making skills",
      "Quick grasping ability, easily remembers figures and names, but tends to have short-term memory",
    ],
  },
  {
    question:
      "Which option best describes your stress management ability in the workplace?",
    options: [
      "I can easily manage stress",
      "I have a moderate ability to manage stress",
      "I have a low capacity for managing stress",
    ],
  },
  {
    question: "Which of the following best describes your skin color and type?",
    options: [
      "Warm and fair, flawless, with oily skin",
      "Very fair with moles and combination skin",
      "Olive to brownish-dark, with dry skin",
    ],
  },
  {
    question: "Which option best represents your height and weight ratio?",
    options: [
      "BMI between 21-25 and above",
      "BMI between 18-21",
      "BMI below 18",
    ],
  },
  {
    question: "Which option best reflects your digestion and bowel regularity?",
    options: [
      "Takes more time for defecation but is regular",
      "Very good digestion with regular bowel movements",
      "Bowel movements every 2-3 days or less frequently",
    ],
  },
  {
    question: "Which of the following best describes your taste preferences?",
    options: [
      "Sweet, sour, and salty",
      "Sweet, bitter, and astringent",
      "Pungent, bitter, and astringent",
    ],
  },
  {
    question:
      "Which of the following best describes the effects of your food habits on digestion?",
    options: [
      "Regular food habits are fine, but heavy and oily foods make me feel lethargic and drowsy",
      "Overeating, heavy food, and travel don't significantly affect my digestion",
      "My food and sleep patterns sometimes affect my digestion, sometimes not",
    ],
  },
  {
    question: "Which option best describes your lifestyle?",
    options: [
      "Stress-free and comfortable",
      "Medium stress with traveling and irregular food patterns",
      "Stressful work life with excessive traveling, altered shifts, and irregular food and sleep patterns",
    ],
  },
];

const productQuestions = [
  {
    question: "What are your top concerns? Select one or more options",
    options: [
      {
        index: 1,
        text: "Anorexia",
        description: "Appetite related issue",
        issues: [
          "Loss of appetite",
          "Decreased Hunger",
          "Bitter Taste of mouth",
          "Feeling of fullness in stomach",
        ],
      },
      {
        index: 2,
        text: "Indigestion",
        description: "Digestion related issue",
        issues: [
          "Feeling of lethargic",
          "Drowsy",
          "Heaviness of stomach",
          "Headache and uneasiness",
          "Undesired to start any work",
        ],
      },
      {
        index: 3,
        text: "Nausea & vomiting",
        description: "Nausea or vomiting",
        issues: [
          "Vomiting induced during travelling",
          "Morning sickness during pregnancy",
        ],
      },
      {
        index: 4,
        text: "Diarrhoea",
        description: "Diarrhoea",
        issues: [
          "Food poisoning or diarrhoea due to irregular eating",
          "Excessive travelling",
          "Heat stroke",
        ],
      },
      {
        index: 5,
        text: "Bloating / Abdominal pain",
        description: "Gastric problems",
        issues: [
          "Gas or flatulence",
          "Obstruction of belching and flatus",
          "Excessive chest pain after consuming beans",
          "Feeling of headache and dizziness",
          "Audible fast heartbeats",
        ],
      },
      {
        index: 6,
        text: "Irritable bowel syndrome",
        description: "Bowel related issue",
        issues: [
          "Feeling urge of defecation directly after meal",
          "Occurs when there is anxiety",
          "Associated with anger issues",
        ],
      },
      {
        index: 7,
        text: "Headache",
        description: "Stress or anxiety related issues",
        issues: [
          "Peripheral regions of eyeball and temporal lobe",
          "Resulted from excessive crying, lack of sleep",
          "Not taken food for long time, anxiety, stress",
        ],
      },
      {
        index: 8,
        text: "Seasonal and allergic flu",
        description: "Allergy",
        issues: [
          "Troubles with improper sleep, irregular diet",
          "Due to season change or contact with allergens",
          "Caused by sudden contact of sunlight",
        ],
      },
      {
        index: 9,
        text: "Productive cough",
        description: "Productive cough",
        issues: [
          "Troubles after rain, cold wind during travelling",
          "Excessive sweet consumption",
          "Cold water headache in winters",
        ],
      },
      {
        index: 10,
        text: "Cold & Dry coughing",
        description: "Cold and dry cough",
        issues: [
          "Infectious cold and itchy throat with dry cough",
          "Tonsillitis, infection of pharynx or larynx",
        ],
      },
      {
        index: 11,
        text: "Menstrual cramps",
        description: "Menstrual cramps",
        issues: [
          "Excessive menstrual cramps on the first day of menses",
          "Cramps subside on the next day with normal flow",
        ],
      },
      {
        index: 12,
        text: "Sore throat",
        description: "Sore throat or hoarseness of voice",
        issues: [
          "Discomfort after cold or dry food",
          "Excessive talking especially for teachers, lawyers, doctors",
        ],
      },
      {
        index: 13,
        text: "Acidity with Indigestion",
        description: "Acidity and indigestion",
        issues: [
          "Burning sensation in chest or abdomen",
          "Worsens after cold and sweet foods like milk or ice cream",
          "Not related to time or type of meal",
        ],
      },
      {
        index: 14,
        text: "Acidity without Indigestion",
        description: "Only acidity",
        issues: [
          "Subsides after cold or sweet foods like ice-cream or milk",
          "Triggered by spicy, salty, sour, fermented foods",
        ],
      },
      {
        index: 15,
        text: "Bleeding diarrhoea / Bleeding piles",
        description: "Bleeding with stool",
        issues: [
          "Caused by hard, dry stool from fat-free diet",
          "Painful bowel movements and post-defecation burning",
        ],
      },
      {
        index: 16,
        text: "Thirst",
        description: "Excessive thirst due to underlying conditions",
        issues: [
          "Excessive thirst from fever, sunstroke",
          "Oily food consumption, indigestion",
        ],
      },
      {
        index: 17,
        text: "Fever",
        description: "Fever",
        issues: [
          "Lack of hunger, excessive body heat, lack of sweating",
          "Loss of taste",
        ],
      },
      {
        index: 18,
        text: "Burning in body",
        description: "Excessive burning and sweating",
        issues: [
          "Due to sunstroke, excessive sweating in summer",
          "Burning after alcohol consumption",
        ],
      },
      {
        index: 19,
        text: "Debility or fatigue",
        description: "Exhaustion due to work",
        issues: [
          "Fatigue after work, travelling, lack of sleep",
          "Due to excessive walking or running",
        ],
      },
      {
        index: 20,
        text: "Need of refreshment",
        description: "Lack of energy",
        issues: [
          "Starving for long time, dehydration",
          "Due to sun or kitchen heat during summer",
        ],
      },
    ],
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Internal Health");
  const [expandedOptions, setExpandedOptions] = useState({});
  const [selectedIssues, setSelectedIssues] = useState({});
  const [currentQuestions, setCurrentQuestions] = useState(bodyQuestions);
  const [optionsList, setOptionsList] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [isProductSuggestionReady, setIsProductSuggestionReady] =
    useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  ChartJS.register(ArcElement, Tooltip, Legend);

  // Scroll to bottom whenever the chatHistory updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  const initializeState = (mode) => {
    setCurrentQuestionIndex(0);
    setChatHistory([]);
    setExpandedOptions({});
    setSelectedIssues({});
    setIsQuizCompleted(false);
    setIsProductSuggestionReady(false);
    setSelectedAnswer(null);

    if (mode === "Product suggestion") {
      setCurrentQuestions(productQuestions);
      setOptionsList(productQuestions[0]?.options || []);
    } else {
      setCurrentQuestions(bodyQuestions);
      setOptionsList([]); // Clear optionsList for Internal Health mode
    }
  };

  useEffect(() => {
    initializeState(selectedTab);
  }, [selectedTab]);

  const handleOptionClick = (option) => {
    const optionText = option.text;
    setExpandedOptions((prev) => ({
      ...prev,
      [optionText]: !prev[optionText],
    }));
  };

  const handleIssueToggle = (optionText, issue) => {
    setSelectedIssues((prev) => ({
      ...prev,
      [optionText]: {
        ...(prev[optionText] || {}),
        [issue]: !prev[optionText]?.[issue],
      },
    }));
  };

  const handleSubmitIssues = (option) => {
    const optionText = option.text;
    const issuesSelected = selectedIssues[optionText]
      ? Object.entries(selectedIssues[optionText])
          .filter(([, selected]) => selected)
          .map(([issue]) => issue)
      : [];

    if (issuesSelected.length > 0) {
      setChatHistory((prevChat) => [
        ...prevChat,
        { type: "question", text: option.description },
        {
          type: "answer",
          text: issuesSelected.join(", "),
          index: option.index,
        },
      ]);

      setOptionsList((prevOptions) =>
        prevOptions.filter((opt) => opt.text !== optionText)
      );

      setSelectedIssues((prev) => {
        const newIssues = { ...prev };
        delete newIssues[optionText];
        return newIssues;
      });

      setExpandedOptions((prev) => ({
        ...prev,
        [optionText]: false,
      }));

      if (selectedTab === "Product suggestion") {
        setIsProductSuggestionReady(true);
      }
    }
  };

  const handleRemoveSelection = (answerIndex) => {
    // Remove paired question/answer from chat history
    setChatHistory((prevChat) => {
      const updated = [];
      for (let i = 0; i < prevChat.length; i++) {
        const q = prevChat[i];
        const a = prevChat[i + 1];
        if (
          q?.type === "question" &&
          a?.type === "answer" &&
          a?.index === answerIndex
        ) {
          i++; // skip this pair
          continue;
        }
        updated.push(q);
      }
      const anyAnswersLeft = updated.some((item) => item?.type === "answer");
      setIsProductSuggestionReady(anyAnswersLeft);
      return updated;
    });

    // Restore option back into the list (if missing) and keep sorted by index
    const originalOption = productQuestions[0]?.options?.find(
      (opt) => opt.index === answerIndex
    );
    if (originalOption) {
      setOptionsList((prev) => {
        const exists = prev.some((opt) => opt.index === answerIndex);
        if (exists) return prev;
        const merged = [...prev, originalOption];
        merged.sort((a, b) => (a.index || 0) - (b.index || 0));
        return merged;
      });
    }
  };

  const handleBodyOptionClick = (option, index) => {
    setSelectedAnswer(option);
    setChatHistory((prevChat) => [
      ...prevChat,
      {
        type: "question",
        text: currentQuestions[currentQuestionIndex].question,
      },
      { type: "answer", text: option, index: index },
    ]);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < currentQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedAnswer(null);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleReset = () => {
    initializeState(selectedTab);
    setQuizResult(null);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
    }
  };

  const handleNext = () => {
    if (selectedAnswer && currentQuestionIndex < currentQuestions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedAnswer(null);
    }
  };

  const handleBodyStructure = () => {
    const getLetterFromIndex = (idx) => String.fromCharCode(97 + idx);
    const responses = chatHistory
      .filter((_, idx) => idx % 2 === 1)
      .slice(4)
      .map((item) => getLetterFromIndex(item.index));

    const counts = { a: 0, b: 0, c: 0 };
    responses.forEach((response) => {
      if (counts.hasOwnProperty(response)) counts[response]++;
    });

    const countsArray = [
      { type: "Kapha", count: counts.a },
      { type: "Pitta", count: counts.b },
      { type: "Vata", count: counts.c },
    ];

    // Sort countsArray by count in descending order
    countsArray.sort((x, y) => y.count - x.count);

    let result = "";
    const [first, second, third] = countsArray.map((item) => item.count);

    // Option 1 logic: >50% single; else any two >30% → those two; else top two
    const totalResponses = counts.a + counts.b + counts.c;
    const doshas = [
      { key: "a", type: "Kapha", count: counts.a },
      { key: "b", type: "Pitta", count: counts.b },
      { key: "c", type: "Vata", count: counts.c },
    ];

    // Avoid divide-by-zero; if no responses, default to top two by count (will be zeros)
    const safeTotal = totalResponses === 0 ? 1 : totalResponses;
    const doshasWithPct = doshas.map((d) => ({
      ...d,
      percentage: (d.count / safeTotal) * 100,
    }));

    doshasWithPct.sort((x, y) => y.percentage - x.percentage);

    if (doshasWithPct[0].percentage > 50) {
      result = doshasWithPct[0].type;
    } else {
      const aboveThirty = doshasWithPct.filter((d) => d.percentage > 30);
      if (aboveThirty.length >= 2) {
        result = `${doshasWithPct[0].type}-${doshasWithPct[1].type}`;
      } else {
        result = `${doshasWithPct[0].type}-${doshasWithPct[1].type}`;
      }
    }

    // Advice based on the result
    let advice = "";
    if (result === "Vata") {
      advice = `As a Vata type, focus on warm, grounding foods like soups and stews. A regular daily routine helps keep you balanced. Avoid overly cold, dry foods.`;
    } else if (result === "Pitta") {
      advice = `Pitta types benefit from cooling, hydrating foods like cucumbers and greens. Avoid spicy or acidic foods, and practice calming activities to reduce intensity.`;
    } else if (result === "Kapha") {
      advice = `Kapha types should focus on light, spicy foods and stay active. Avoid heavy, oily foods and stick to a stimulating routine to prevent stagnation.`;
    } else if (result === "Vata-Pitta" || result === "Pitta-Vata") {
      advice = `As a Vata-Pitta type, balance warm, grounding foods with hydrating, cooling options. Avoid overly spicy or dry foods and keep a consistent routine.`;
    } else if (result === "Pitta-Kapha" || result === "Kapha-Pitta") {
      advice = `For Pitta-Kapha, choose foods that are both cooling and light, and avoid heavy, oily dishes. Regular exercise and moderation help keep you in balance.`;
    } else if (result === "Vata-Kapha" || result === "Kapha-Vata") {
      advice = `Vata-Kapha types benefit from warm, nourishing foods with light spices. A balanced routine with moderate activity keeps both doshas balanced.`;
    } else {
      advice = `As a Tri-Dosha, maintain variety in foods and activities to support all three doshas. Balance is key, with seasonal adjustments as needed.`;
    }

    setQuizResult({ type: result, advice, counts });
  };

  const handleProductSuggestion = () => {
    const getLetterFromIndex = (idx) => String.fromCharCode(97 + idx);
    const selectedIssuesArray = chatHistory
      .filter((_, idx) => idx % 2 === 1)
      .map((item, idx) => item.index);
    // .map((item, idx) => `${item.index}-${item.text}`);

    navigate("/suggest-products", {
      state: { selectedIssuesArray },
    });
  };

  const renderCurrentView = () => {
    if (selectedTab === "Internal Health") {
      if (isQuizCompleted) {
        return (
          <div className="question-section">
            <button className="submit-btn" onClick={handleBodyStructure}>
              Submit Assessment
            </button>
          </div>
        );
      }

      const currentQuestion = currentQuestions[currentQuestionIndex];
      return (
        <div className="question-section">
          <h3 className="question-text">{currentQuestion?.question}</h3>
          <div className="options-container">
            {currentQuestion?.options?.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswer === option ? "selected" : ""
                }`}
                onClick={() => handleBodyOptionClick(option, index)}>
                {option}
              </button>
            ))}
          </div>
          <div className="navigation">
            <button
              className="nav-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}>
              ← Previous
            </button>
            {/* <button
              className="nav-btn next-btn"
              onClick={handleNext}
              disabled={
                !selectedAnswer ||
                currentQuestionIndex === currentQuestions.length - 1
              }>
              Next →
            </button> */}
          </div>
        </div>
      );
    }

    // Build submitted selections from chat-style history (question followed by answer)
    const submittedSelections = [];
    for (let i = 0; i < chatHistory.length - 1; i++) {
      const q = chatHistory[i];
      const a = chatHistory[i + 1];
      if (q?.type === "question" && a?.type === "answer") {
        submittedSelections.push({
          question: q.text,
          answer: a.text,
          index: a.index,
        });
        i++; // skip the paired answer on next loop iteration
      }
    }

    return (
      <div className="question-section">
        {isProductSuggestionReady && (
          <button className="submit-btn" onClick={handleProductSuggestion}>
            Suggest Products
          </button>
        )}
        <h3 className="question-text">{productQuestions[0]?.question}</h3>
        {submittedSelections.length > 0 && (
          <div className="selected-summary">
            <h4>Your selections</h4>
            <div className="chips">
              {submittedSelections.map((sel, idx) => (
                <div key={idx} className="chip">
                  <span className="chip-label">{sel.question}:</span>{" "}
                  {sel.answer}
                  <button
                    type="button"
                    className="chip-remove"
                    aria-label="Remove selection"
                    onClick={() => handleRemoveSelection(sel.index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="options-container">
          {optionsList.map((option, index) => (
            <div key={index}>
              <button
                className="option-btn"
                onClick={() => handleOptionClick(option)}>
                {option.text}
              </button>
              {expandedOptions[option.text] && (
                <div className="expanded-options">
                  {option.issues.map((issue, issueIndex) => (
                    <div key={issueIndex} className="issue-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIssues[option.text]?.[issue] || false}
                        onChange={() => handleIssueToggle(option.text, issue)}
                      />
                      {issue}
                    </div>
                  ))}
                  <button
                    className="submit-issues-btn"
                    onClick={() => handleSubmitIssues(option)}>
                    Submit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h1>Self Assessment</h1>
          <button className="reset-btn" onClick={handleReset}>
            <MdOutlineRestartAlt />
          </button>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-btn ${
              selectedTab === "Internal Health" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedTab("Internal Health");
              setCurrentQuestions(bodyQuestions);
              setQuizResult(null);
            }}>
            Internal Health
          </button>
          <button
            className={`tab-btn ${
              selectedTab === "Product suggestion" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedTab("Product suggestion");
              setCurrentQuestions(productQuestions);
              setQuizResult(null);
            }}>
            Product suggestion
          </button>
        </div>

        {selectedTab === "Internal Health" && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        )}

        {renderCurrentView()}

        {quizResult && (
          <div className="result-section">
            <h2>Assessment Complete!</h2>
            <p>Here's the analysis based on your answers.</p>
            <div className="chart-container">
              <Pie
                data={{
                  labels: ["Kapha", "Pitta", "Vata"],
                  datasets: [
                    {
                      data: [
                        (quizResult.counts.a / 13) * 100,
                        (quizResult.counts.b / 13) * 100,
                        (quizResult.counts.c / 13) * 100,
                      ],
                      backgroundColor: ["#355935", "#5d8c55", "#93be89"],
                      hoverBackgroundColor: ["#355935", "#5d8c55", "#93be89"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                      onClick: () => {},
                    },
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          return `${
                            tooltipItem.label
                          }: ${tooltipItem.raw.toFixed(1)}%`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <h3>Your body structure is: {quizResult.type}</h3>
            <p className="advice-text">{quizResult.advice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
