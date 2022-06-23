import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Authentication from "./Components/Authentication/Authentication";
import FileNotFound from "./Components/NotFound/FileNotFound";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import ResetPassword from "./Components/Authentication/ResetPassword";
import Messenger from "./Components/Chat/Messenger";
import Home from "./Components/Home/Home";
import "react-toastify/dist/ReactToastify.css";
import "./Css/Forms.css";
import "./Css/Index.css";

/**
 * Context for color scheme and message modes
 */
export const SettingsContext = createContext();

/**
 * Root component of the application.
 *  Handles routing to the different sides through react router library.
 *  Additionally provides the settings context, so every component has access to it.
 *  It also provides the Toast Container in order to display toasts.
 */
export default function App() {
  const [colorMode, setColorMode] = useState(
    localStorage.getItem("colorMode") || COLOR_MODES.GRADIENT_COLOR
  );
  const [gradientScheme, setGradientScheme] = useState(
    localStorage.getItem("gradientScheme") || GRADIENT_SCHEME.SUNSET
  );
  const [colorScheme, setColorScheme] = useState(
    localStorage.getItem("colorScheme") || COLOR_SCHEME.WHITE
  );
  const [messageMode, setMessageMode] = useState(
    localStorage.getItem("messageMode") || MESSAGE_MODES.ENTER
  );

  useEffect(() => {
    if (colorMode === COLOR_MODES.GRADIENT_COLOR) {
      document.documentElement.style.setProperty(
        "--c-gradient-1",
        `var(--scheme-${gradientScheme}-1, #FF7A00)`
      );
      document.documentElement.style.setProperty(
        "--c-gradient-2",
        `var(--scheme-${gradientScheme}-2, #FF00C7)`
      );
      localStorage.setItem("gradientScheme", gradientScheme);
    } else if (colorMode === COLOR_MODES.SINGLE_COLOR) {
      document.documentElement.style.setProperty(
        "--c-gradient-1",
        `var(--scheme-${colorScheme}-1, red)`
      );
      document.documentElement.style.setProperty(
        "--c-gradient-2",
        `var(--scheme-${colorScheme}-1, red)`
      );
      localStorage.setItem("colorScheme", colorScheme);
    }

    localStorage.setItem("colorMode", colorMode);
  }, [colorMode, gradientScheme, colorScheme]);

  useEffect(() => {
    localStorage.setItem("messageMode", messageMode);
  }, [messageMode]);

  return (
    <>
      <SettingsContext.Provider
        value={{
          colorMode,
          setColorMode,
          messageMode,
          setMessageMode,
          gradientScheme,
          setGradientScheme,
          colorScheme,
          setColorScheme,
        }}
      >
        <BrowserRouter>
          <div>
            <Switch>
              <Route path="/forgot-password" component={ForgotPassword} exact />
              <Route path="/reset-password" component={ResetPassword} exact />
              <Route path="/home" component={Home} exact />
              <Route path="/login" component={Authentication} exact />
              <Route path="/" component={Messenger} exact />
              <Route component={FileNotFound} exact />
            </Switch>
          </div>
        </BrowserRouter>
      </SettingsContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="background">
        <svg viewBox="0 0 900 600" preserveAspectRatio="none">
          <rect x="0" y="0" width="900" height="600" fill="#001220"></rect>
          <path
            d="M0 435L21.5 423.7C43 412.3 86 389.7 128.8 379.7C171.7 369.7 214.3 372.3 257.2 384.2C300 396 343 417 385.8 428.8C428.7 440.7 471.3 443.3 514.2 431C557 418.7 600 391.3 642.8 386C685.7 380.7 728.3 397.3 771.2 395.2C814 393 857 372 878.5 361.5L900 351L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="var(--c-gradient-2)"
            filter="brightness(80%)"
          ></path>
          <path
            d="M0 408L21.5 419.8C43 431.7 86 455.3 128.8 462C171.7 468.7 214.3 458.3 257.2 456.3C300 454.3 343 460.7 385.8 454.8C428.7 449 471.3 431 514.2 427.2C557 423.3 600 433.7 642.8 436.8C685.7 440 728.3 436 771.2 435.7C814 435.3 857 438.7 878.5 440.3L900 442L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="var(--c-gradient-1)"
            opacity={0.5}
            filter="brightness(80%)"
          ></path>
          <path
            d="M0 478L21.5 473.2C43 468.3 86 458.7 128.8 456.3C171.7 454 214.3 459 257.2 468.2C300 477.3 343 490.7 385.8 497.7C428.7 504.7 471.3 505.3 514.2 495.2C557 485 600 464 642.8 462.2C685.7 460.3 728.3 477.7 771.2 482.3C814 487 857 479 878.5 475L900 471L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="var(--c-gradient-1)"
            opacity={0.5}
            filter="brightness(80%)"
          ></path>
          <path
            d="M0 523L21.5 523.5C43 524 86 525 128.8 523.2C171.7 521.3 214.3 516.7 257.2 511.7C300 506.7 343 501.3 385.8 497.3C428.7 493.3 471.3 490.7 514.2 490.8C557 491 600 494 642.8 502.7C685.7 511.3 728.3 525.7 771.2 533C814 540.3 857 540.7 878.5 540.8L900 541L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="var(--c-gradient-1)"
            opacity={0.5}
            filter="brightness(80%)"
          ></path>
          <path
            d="M0 550L21.5 550.8C43 551.7 86 553.3 128.8 550.2C171.7 547 214.3 539 257.2 540.8C300 542.7 343 554.3 385.8 553.5C428.7 552.7 471.3 539.3 514.2 538.7C557 538 600 550 642.8 556.3C685.7 562.7 728.3 563.3 771.2 564.8C814 566.3 857 568.7 878.5 569.8L900 571L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z"
            fill="var(--c-gradient-1)"
            filter="brightness(80%)"
          ></path>
        </svg>
      </div>
    </>
  );
}

export const COLOR_MODES = Object.freeze({
  GRADIENT_COLOR: "GRADIENT_COLOR",
  SINGLE_COLOR: "SINGLE_COLOR",
});

export const MESSAGE_MODES = Object.freeze({
  ENTER: "ENTER",
  ENTER_CTRL: "ENTER_CTRL",
  ENTER_SHIFT: "ENTER_SHIFT",
});

export const GRADIENT_SCHEME = Object.freeze({
  UNDERWATER: "underwater",
  SUNSET: "sunset",
  MONITY: "monity",
  ICY: "icy",
});

export const COLOR_SCHEME = Object.freeze({
  GREEN: "green",
  RED: "red",
  BLUE: "blue",
  GREY: "grey",
});
