import { useState, useEffect, useCallback } from "react";
const Viewport = () => {
  const [phoneViewport, setViewPort] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [current, setCurrentView] = useState(window.innerWidth);
  const toggleHandler = useCallback(() => {
    setToggle((prev) => !prev);
  }, []);

  const detectView = useCallback(() => {
    setCurrentView(() => window.innerWidth);
  }, [setCurrentView]);
  const laptopViewPort = toggle || !phoneViewport;
  useEffect(() => {
    //  setWidth(() => window.innerWidth);
    window.addEventListener("resize", detectView);
    if (current <= 600) {
      setViewPort(true);
      setToggle(false);
    } else {
      setViewPort(false);
    }

    return () => {
      window.removeEventListener("resize", detectView);
    };
  }, [current, detectView]);

  return {
    laptopViewPort,
    toggle,
    toggleHandler,
    phoneViewport,
  };
};

export default Viewport;
