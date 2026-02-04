import { useEffect, useRef, useState } from "react";

export default function Calculator() {
  // ======================
  // ESTADO
  // ======================
  const [currentValue, setCurrentValue] = useState("0");
  const [previousValue, setPreviousValue] = useState("");
  const [operator, setOperator] = useState(null);
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [isScientificOpen, setIsScientificOpen] = useState(false);
  const [isLight, setIsLight] = useState(
    localStorage.getItem("theme") === "light"
  );
  const [soundOn, setSoundOn] = useState(true);

  // ======================
  // SOM
  // ======================
  const clickSound = useRef(null);

  useEffect(() => {
    clickSound.current = new Audio("/assets/click.mp3");
  }, []);

  function feedback() {
    if (!soundOn) return;
    clickSound.current.currentTime = 0;
    clickSound.current.play().catch(() => {});
    navigator.vibrate?.(20);
  }

  // ======================
  // TEMA
  // ======================
  useEffect(() => {
    document.body.classList.toggle("light", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }, [isLight]);

  // ======================
  // DISPLAY
  // ======================
  function appendNumber(n) {
    feedback();

    if (currentValue === "0" && n !== ".") {
      setCurrentValue(n);
      return;
    }

    if (n === "." && currentValue.includes(".")) return;

    setCurrentValue(prev => prev + n);
  }

  function chooseOperator(op) {
    feedback();

    if (!currentValue) return;

    if (previousValue) calculate();

    setOperator(op);
    setPreviousValue(`${currentValue} ${op}`);
    setCurrentValue("");
  }

  function calculate() {
    feedback();

    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);

    if (isNaN(prev) || isNaN(curr)) return;

    let result;
    switch (operator) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "*":
        result = prev * curr;
        break;
      case "/":
        result = curr === 0 ? "Erro" : prev / curr;
        break;
      default:
        return;
    }

    const expr = `${prev} ${operator} ${curr} = ${result}`;

    setHistory(h => [{ expr, result }, ...h.slice(0, 9)]);
    setCurrentValue(result.toString());
    setPreviousValue("");
    setOperator(null);
  }

  // ======================
  // CIENTÍFICA
  // ======================
  function scientific(fn) {
    feedback();

    const v = parseFloat(currentValue);
    if (isNaN(v)) return;

    const deg = Math.PI / 180;

    const ops = {
      sqrt: Math.sqrt(v),
      square: v ** 2,
      percent: v / 100,
      sin: Math.sin(v * deg),
      cos: Math.cos(v * deg),
      tan: Math.tan(v * deg),
      log: Math.log10(v)
    };

    setCurrentValue(ops[fn].toString());
  }

  // ======================
  // HISTÓRICO
  // ======================
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  // ======================
  // TECLADO
  // ======================
  useEffect(() => {
    function handleKey(e) {
      if (!isNaN(e.key)) appendNumber(e.key);
      if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);
      if (e.key === ".") appendNumber(".");
      if (e.key === "Enter") calculate();
      if (e.key === "Backspace")
        setCurrentValue(v => v.slice(0, -1) || "0");
      if (e.key === "Escape") setCurrentValue("0");
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  // ======================
  // RENDER
  // ======================
  return (
    <main className="calculator" role="application">
      {/* HEADER */}
      <header className="calculator-header">
        <span className="title">ToniCalc</span>

        <div className="actions">
          <button onClick={() => setSoundOn(!soundOn)}>
            {soundOn ? "🔊" : "🔇"}
          </button>

          <button onClick={() => setIsLight(!isLight)}>
            {isLight ? "☀️" : "🌙"}
          </button>

          <button onClick={() => setIsScientificOpen(!isScientificOpen)}>
            fx
          </button>
        </div>
      </header>

      {/* DISPLAY */}
      <section className="display">
        <div className="previous">{previousValue}</div>
        <div className="current">{currentValue}</div>
      </section>

      {/* HISTÓRICO */}
      <section className="history">
        <div className="history-header">
          <span>Histórico</span>
          <button
            onClick={() => {
              setHistory([]);
              localStorage.removeItem("history");
            }}
          >
            Limpar
          </button>
        </div>

        <ul id="historyList">
          {history.map((item, index) => (
            <li
              key={index}
              onClick={() => setCurrentValue(item.result.toString())}
            >
              {item.expr}
            </li>
          ))}
        </ul>
      </section>

      {/* CIENTÍFICA */}
      <section
        className={`scientific-panel ${
          isScientificOpen ? "active" : ""
        }`}
      >
        <button className="btn fn" onClick={() => scientific("sqrt")}>√</button>
        <button className="btn fn" onClick={() => scientific("square")}>x²</button>
        <button className="btn fn" onClick={() => scientific("percent")}>%</button>
        <button className="btn fn" onClick={() => setCurrentValue(Math.PI.toString())}>π</button>

        <button className="btn fn" onClick={() => scientific("sin")}>sin</button>
        <button className="btn fn" onClick={() => scientific("cos")}>cos</button>
        <button className="btn fn" onClick={() => scientific("tan")}>tan</button>
        <button className="btn fn" onClick={() => scientific("log")}>log</button>
      </section>

      {/* BOTÕES */}
      <section className="buttons">
        <button className="btn danger" onClick={() => setCurrentValue("0")}>C</button>
        <button className="btn" onClick={() => appendNumber("(")}>(</button>
        <button className="btn" onClick={() => appendNumber(")")}>)</button>
        <button className="btn operator" onClick={() => chooseOperator("/")}>÷</button>

        <button className="btn" onClick={() => appendNumber("7")}>7</button>
        <button className="btn" onClick={() => appendNumber("8")}>8</button>
        <button className="btn" onClick={() => appendNumber("9")}>9</button>
        <button className="btn operator" onClick={() => chooseOperator("*")}>×</button>

        <button className="btn" onClick={() => appendNumber("4")}>4</button>
        <button className="btn" onClick={() => appendNumber("5")}>5</button>
        <button className="btn" onClick={() => appendNumber("6")}>6</button>
        <button className="btn operator" onClick={() => chooseOperator("-")}>−</button>

        <button className="btn" onClick={() => appendNumber("1")}>1</button>
        <button className="btn" onClick={() => appendNumber("2")}>2</button>
        <button className="btn" onClick={() => appendNumber("3")}>3</button>
        <button className="btn operator" onClick={() => chooseOperator("+")}>+</button>

        <button className="btn zero" onClick={() => appendNumber("0")}>0</button>
        <button className="btn" onClick={() => appendNumber(".")}>.</button>
        <button className="btn equal" onClick={calculate}>=</button>
      </section>
    </main>
  );
}