import { useState, useEffect } from "react";

const App = () => {
  const initialQuestion = "Q: Is the character human?";
  const [sessionId, setSessionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState(initialQuestion);
  const [thoughts, setThoughts] = useState("");

  useEffect(() => {
    const storedSessionId = "id" + Math.random().toString(16).slice(2);
    setSessionId(storedSessionId);
    console.log(storedSessionId);
  }, []);

  const handleSubmit = async () => {
    // If the last AI response was a guess and user says "yes", reset the game instead of fetching
    if (question.startsWith("G:") && answer === "yes") {
      handleReset();
      return;
    }

    const response = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answer }),
    });

    if (response.ok) {
      const data = await response.json();
      setQuestion(data.answer);
      setThoughts(data.thoughts);
    } else {
      console.error("Error fetching question");
    }

    setAnswer("");
  };

  const handleReset = async () => {
    await fetch("/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answer }),
    });
    setQuestion(initialQuestion);
    setThoughts("");
  };

  return (
    <div className="centered-container">
      <div className="game-box">
        <i>✨ This game is powered by Gemini ✨</i>
        {/* Question */}
        <div className="question">
          <h3>{question}</h3>
        </div>
        {/* Thoughts */}
        <div className="question">
          <i>{thoughts}</i>
        </div>
        {/* Radio options */}
        <div className="options">
          <label>
            <input
              className="radio"
              type="radio"
              value="yes"
              checked={answer === "yes"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            Yes
          </label>
          <label>
            <input
              className="radio"
              type="radio"
              value="no"
              checked={answer === "no"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            No
          </label>
          <label>
            <input
              className="radio"
              type="radio"
              value="I don't know"
              checked={answer === "I don't know"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            I don't know
          </label>
          <label>
            <input
              className="radio"
              type="radio"
              value="Probably"
              checked={answer === "Probably"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            Probably
          </label>
          <label>
            <input
              className="radio"
              type="radio"
              value="Probably not"
              checked={answer === "Probably not"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            Probably not
          </label>
        </div>
        {/* Buttons */}
        <div className="buttons">
          <button className="button" onClick={handleReset}>
            Reset
          </button>
          <button className="button" onClick={handleSubmit} disabled={!answer}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
