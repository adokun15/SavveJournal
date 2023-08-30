import { useState } from "react";

import cls from "./AuthBody.module.css";
import {
  Form,
  json,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { app, db } from "../FireApp";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import LoaderBtn from "../loader/LoaderButton";
const Auth = ({ close, dir, navigator }) => {
  const [isActive, setActive] = useState(dir || "s");
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const errorMes = useActionData();

  const loginHandler = () => {
    setActive("l");
    navigate("/?type=login");
  };

  const signupHandler = () => {
    setActive("s");
    navigate("/?type=signup");
  };

  const activeAuthL =
    isActive === "l" ? `${cls.navBtn} ${cls.btnActive}` : `${cls.navBtn}`;
  const activeAuthS =
    isActive === "s" ? `${cls.navBtn} ${cls.btnActive}` : `${cls.navBtn}`;

  return (
    <div className={cls.auth}>
      <nav className={cls.authnav}>
        <button onClick={loginHandler} className={activeAuthL}>
          login
        </button>
        <button onClick={signupHandler} className={activeAuthS}>
          signup
        </button>
      </nav>
      <h1>
        Save<span>Journal</span>
        <p className={cls.errMes}>
          {errorMes ? errorMes.message.toLowerCase() : ""}
        </p>
      </h1>
      <div className={cls.authFormContainer}>
        <Form method="post" className={cls.authForm}>
          {isActive === "s" && (
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cls.input}
              name="name"
              placeholder="John Steve"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cls.input}
            name="email"
            placeholder="example@gmail.com"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            className={`${cls.input} ${cls.passwordToggle}`}
            placeholder="******"
          />
          <button type="submit">
            {navigation.state === "submitting" ? <LoaderBtn /> : "submit"}
          </button>
        </Form>
      </div>

      <div className={cls.closeBody}>
        <button className={cls.closeBtn} onClick={close}>
          x
        </button>
      </div>
    </div>
  );
};
export default Auth;

export async function AuthAction({ request }) {
  const searchParam = new URL(request.url).searchParams;
  const mode = searchParam.get("type") || "signup";

  if (mode !== "login" && mode !== "signup") {
    return json({ message: "404 Page Not Found" }, 404);
  }
  const data = await request.formData();

  const user = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
  };

  let error = {};
  const auth = getAuth();
  let userId = null;
  if (user.name === "") {
    error.message = "Empty name Space!";
    return error;
  }
  if (mode === "signup") {
    await createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((res) => {
        const obj = {
          token: res._tokenResponse.refreshToken,
          email: res._tokenResponse.email,
          id: res.user.uid,
          expiration: res._tokenResponse.expiresIn,
        };

        userId = obj.id;

        localStorage.setItem("user", JSON.stringify(obj));
        addDoc(collection(db, "JournalUsers"), {
          name: user.name,
          id: res.user.uid,
          journals: [],
        });

        redirect(`/${obj.id}`);
      })
      .catch((e) => {
        const mes = e.code.split("/");
        //throw json({ message: mes[1] }, { status: 500 });
        let temp = mes[1]
          .toUpperCase()
          .split("-")
          .map((w) => (w === "USER" ? "ACCOUNT" : w))
          .join(" ");

        let message =
          temp === "NETWORK REQUEST FAILED" ? "NO INTERNET CONNECT" : temp;
        error.message = message;
      });
  }

  if (mode === "login") {
    await signInWithEmailAndPassword(auth, user.email, user.password)
      .then((res) => {
        const obj = {
          token: res._tokenResponse.refreshToken,
          email: res._tokenResponse.email,
          id: res.user.uid,
          expiration: res._tokenResponse.expiresIn,
        };

        userId = obj.id;

        localStorage.setItem("user", JSON.stringify(obj));
        return redirect(`/${obj.id}`);
      })
      .catch((e) => {
        const mes = e.code.split("/");
        let temp = mes[1]
          .toUpperCase()
          .split("-")
          .map((w) => (w === "USER" ? "ACCOUNT" : w))
          .join(" ");

        let message =
          temp === "NETWORK REQUEST FAILED" ? "No Internet Connection" : temp;
        error.message = message;
      });
  }

  if (userId === null) return error;
  const res = redirect(`/${userId}`);
  return res;
}
