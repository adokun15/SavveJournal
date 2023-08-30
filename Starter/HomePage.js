import { useEffect, useState } from "react";
import img from "../Asset/hope-house-press-leather-diary-studio-PJzc7LOt2Ig-unsplash.jpg";
import Modal from "../Auth/Modal";
import cls from "./HomePage.module.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserAction } from "../StatesMng";
const HomePage = () => {
  const [modalOpened, setModal] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const signupHandler = () => {
    navigate("/?type=signup");
  };
  useEffect(() => {
    dispatch(UserAction.refreshData());
  }, [dispatch]);
  return (
    <>
      {modalOpened && <Modal close={() => setModal(false)} />}
      <main className={cls.Home}>
        <h1>
          Savve<span>Journal</span>
        </h1>
        <div className={cls.HomeDesc}>
          <div>
            <h4>
              <span>Create</span> Journal
            </h4>
            <h4>
              <span>Save</span> Journal
            </h4>
            <h4>
              <span>Edit</span> Journal
            </h4>
            <p>
              <i>more features to be unlock... sign up today</i>
            </p>
            <button
              onClick={() => {
                setModal(true);
                signupHandler();
              }}
            >
              Get Started
            </button>
          </div>
          <img loading="lazy" src={img} alt="a book" />
        </div>
      </main>
      <Footer />
    </>
  );
};
export default HomePage;
