import { Form, Outlet, useNavigate, useParams } from "react-router-dom";
import CreateJournal from "./CreateJournal";
import cls from "./Layout.module.css";
import { useCallback, useEffect, useState } from "react";
import { token } from "../util/token";
import { useDispatch } from "react-redux";
import { query, collection, onSnapshot } from "firebase/firestore";
import { db } from "../FireApp";
import { UserAction } from "../StatesMng";
import LoaderBody from "../loader/loaderBody";
import JournalHeader from "./JournalHeader";
import Viewport from "../hook/viewport";
const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();

  const [loader, setLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const dbBase = useCallback(async () => {
    const promise = new Promise((rev) => {
      const User = query(collection(db, "JournalUsers"));
      onSnapshot(User, (querySnaps) => {
        querySnaps.forEach((doc) => {
          if (doc.data().id === param.id) {
            dispatch(
              UserAction.addData({
                username: doc.data().name,
                id: doc.data().id,
                journals: doc.data().journals,
                docId: doc.id,
              })
            );
            setLoader(false);
          }
          rev("success");
        });
      });
    }).catch((e) => console.log(e));
    //

    const promiseTimeOut = new Promise((__, rej) => {
      setTimeout(() => {
        rej("Something went Wrong!");
      }, 10000);
    }).catch((err) => {
      setErrorMessage(err);
    });
    //

    const raceTime = Promise.race([promise, promiseTimeOut]);
    //

    return raceTime;
  }, [dispatch, param.id]);
  useEffect(() => {
    const tokenId = token();

    if (!tokenId) navigate("/");
    if (tokenId.id !== param.id) {
      navigate("/");
    }
    if (tokenId) {
      dbBase();
    }
  }, [navigate, dbBase, param.id]);
  const { phoneViewport } = Viewport();
  return (
    <main className={cls.layout}>
      <JournalHeader cls={cls.layoutNav} />

      {!phoneViewport && <CreateJournal />}

      {!loader && <Outlet />}
      {loader && !errorMessage && <LoaderBody />}
      {loader && errorMessage && (
        <div className={cls.error}>
          <p>{errorMessage}</p>
          <div className={cls.actions}>
            <button
              onClick={() => {
                dbBase();
                setErrorMessage("");
              }}
            >
              Try again
            </button>
            <div>or</div>
            <Form action="/logout" method="post">
              <button> logout</button>
            </Form>
          </div>
        </div>
      )}
    </main>
  );
};
export default Layout;
