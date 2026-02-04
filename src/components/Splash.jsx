import { useEffect, useState } from "react";

export default function Splash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2400);

    return () => clearTimeout(hideTimer);
  }, []);

  if (!visible) return null;

  return (
    <div id="app-splash">
      <img src="/assets/icon-192.png" alt="ToniCalc" />
      <span>ToniCalc</span>

      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
}