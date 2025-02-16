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
      "White-collar job like a government employee, teacher, or banker",
      "High-stress job like student, doctor, corporate sector, IT, or driver",
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
      "Spicy, sour, salty, or bitter flavors, with hot and easily digestible foods, often fermented, boiled, or fully cooked",
      "Mostly sweet, with some astringent or bitter flavors, typically cold, semi-cooked, and containing fats",
      "Sweet, sour, and salty flavors, with hot, fat-containing foods, usually boiled or fully cooked",
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
  const [selectedButton, setSelectedButton] = useState("Body Structure");
  const [expandedOptions, setExpandedOptions] = useState({});
  const [selectedIssues, setSelectedIssues] = useState({});
  const [currentQuestions, setCurrentQuestions] = useState(bodyQuestions);
  const [optionsList, setOptionsList] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [isProductSuggestionReady, setIsProductSuggestionReady] =
    useState(false);
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

    if (mode === "Product Suggestion") {
      setCurrentQuestions(productQuestions);
      setOptionsList(productQuestions[0]?.options || []);
    } else {
      setCurrentQuestions(bodyQuestions);
      setOptionsList([]); // Clear optionsList for Body Structure mode
    }
  };

  useEffect(() => {
    initializeState(selectedButton);
  }, [selectedButton]);

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

      if (selectedButton === "Product Suggestion") {
        setIsProductSuggestionReady(true);
      }
    }
  };

  const handleBodyOptionClick = (option, index) => {
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
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleReset = () => {
    initializeState(selectedButton);
    // document.querySelector(".quiz-class").classList.remove("show-result");
    setQuizResult(null);
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

    // Define logic based on sorted counts
    if (first >= 7 && first >= second + 3 && first >= third + 3) {
      // Single dosha dominance
      result = countsArray[0].type;
    } else if (first >= 5 && second >= 5 && Math.abs(first - second) <= 1) {
      // Dual dosha dominance
      result = `${countsArray[0].type}-${countsArray[1].type}`;
    } else if (Math.abs(first - second) <= 1 && Math.abs(second - third) <= 1) {
      // Tri-Dosha (all counts are close in value)
      result = "Tri-Dosha";
    } else {
      // General case for two close doshas with one lower dosha
      result = `${countsArray[0].type}-${countsArray[1].type}`;
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
    if (selectedButton === "Body Structure") {
      if (isQuizCompleted) {
        return (
          <div className="question-card">
            <button
              className="suggest-products-btn"
              onClick={handleBodyStructure}
            >
              Submit
            </button>
          </div>
        );
      }

      const currentQuestion = currentQuestions[currentQuestionIndex];
      return (
        <div className="question-card">
          <div className="chat-message doctor">{currentQuestion?.question}</div>
          <div className="options">
            {currentQuestion?.options?.map((option, index) => (
              <div
                key={index}
                className="chat-message option"
                onClick={() => handleBodyOptionClick(option, index)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="question-card">
        {isProductSuggestionReady && (
          <button
            className="suggest-products-btn"
            onClick={handleProductSuggestion}
          >
            Suggest Products
          </button>
        )}
        <div className="chat-message doctor">
          {productQuestions[0]?.question}
        </div>
        <div className="options">
          {optionsList.map((option, index) => (
            <div key={index}>
              <div
                className="chat-message option"
                onClick={() => handleOptionClick(option)}
              >
                {option.text}
              </div>
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
                    onClick={() => handleSubmitIssues(option)}
                  >
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

  return (
    <div className="quiz-class">
      <div className={`chat-container ${quizResult ? "show-result" : ""}`}>
        <div className="chat-content">
          <div className="top-buttons">
            <button
              className={`top-button ${
                selectedButton === "Body Structure" ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedButton("Body Structure");
                setCurrentQuestions(bodyQuestions);
                setQuizResult(null);
              }}
            >
              Body Structure
            </button>
            <button
              className={`top-button ${
                selectedButton === "Product Suggestion" ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedButton("Product Suggestion");
                setCurrentQuestions(productQuestions);
                setQuizResult(null);
              }}
            >
              Product Suggestion
            </button>
          </div>
          <div className="chat-header">
            Self Assessment
            <span onClick={handleReset}>
              <MdOutlineRestartAlt />
            </span>
          </div>
          <div
            className={`chat-history ${
              isQuizCompleted ? "increase-height" : ""
            }`}
          >
            {chatHistory.map((item, index) => (
              <div
                key={index}
                className={`chat-message ${
                  item.type === "question" ? "doctor" : "user"
                }`}
              >
                {item.text}
              </div>
            ))}
            {isQuizCompleted && selectedButton === "Body Structure" && (
              <div className="chat-message doctor">
                Thank you for completing the Assessment!
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {renderCurrentView()}
        </div>
        <div className="result-container">
          <p>Here's the analysis based on your answers.</p>
          {quizResult && (
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
                        return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(
                          1
                        )}%`;
                      },
                    },
                  },
                },
              }}
            />
          )}

          <h2>Your body structure is: {quizResult ? quizResult.type : ""}</h2>
          <h5>{quizResult ? quizResult.advice : ""}</h5>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
