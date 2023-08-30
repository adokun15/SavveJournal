import JournalNav from "./JournalNav";
import cls from "./JournalList.module.css";
import viewImg from "../Asset/icons8-view-24.png";
import deleteImg from "../Asset/icons8-delete-24.png";
import archivedImg from "../Asset/icons8-create-archive-24.png";
import editImg from "../Asset/icons8-edit-24.png";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../FireApp";
import ViewItem from "./ViewItem";
import { useState } from "react";
import Viewport from "../hook/viewport";
import CreateJournal from "./CreateJournal";
const JournalList = ({ item, journals, arcImg }) => {
  const user = useSelector((state) => state.reducer);
  const param = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState("");

  const pathFinder = (id) => {
    const ids = id.target.getAttribute("data-id");
    const docid = id.target.getAttribute("data-docid");
    let identifier = id.target.getAttribute("data-identifier");
    if (identifier === "view") {
      setId(ids);
      if (!item.view) item.showView();
    }
    if (identifier === "edit") {
      navigate(`/${param.id}/${ids}/edit?doc=${docid}`);
    }

    if (identifier === "delete") {
      const currentJournal = user.journals.filter(
        (journal) => journal.id !== ids
      );
      const info = { journals: currentJournal };
      const docRef = doc(db, "JournalUsers", user.docId);
      updateDoc(docRef, info);
    }
    if (identifier === "archive") {
      const currentJournal = user.journals.map((journal) => {
        if (journal.id === ids) {
          const { archive } = journal;
          return { ...journal, archive: !archive };
        } else {
          const { archive } = journal;
          return { ...journal, archive: archive };
        }
      });
      const info = { journals: currentJournal };
      const docRef = doc(db, "JournalUsers", user.docId);
      updateDoc(docRef, info);
    }
    return;
  };
  const dateFormat = function (date) {
    const newDate = new Date(date);
    const calcDaysPassed = (prevDate, today) =>
      Math.round(Math.abs(today - prevDate) / (1000 * 60 * 60 * 24));
    const calcMonthsPassed = (prevDate, today) =>
      Math.round(Math.abs(today - prevDate) / (1000 * 60 * 60 * 24 * 30)); //24hour -> 1 day
    const calcYearsPassed = (prevDate, today) =>
      Math.round(Math.abs(today - prevDate) / (1000 * 60 * 60 * 24 * 30 * 365)); //24hour -> 1 day

    const daypassed = calcDaysPassed(new Date(), newDate);
    const monthspassed = calcMonthsPassed(new Date(), newDate);
    const yearsPassed = calcYearsPassed(new Date(), newDate);

    if (daypassed === 0) return "Today";
    if (daypassed === 1) return "Yesterday";
    if (daypassed <= 7) return `${daypassed} days ago`;
    if (daypassed <= 30) return `${monthspassed} days ago`;
    if (daypassed <= 365) return `${yearsPassed} days ago`;
    return new Intl.DateTimeFormat("it-IT").format(newDate);
  };

  const timeFormat = (date) => {
    const time = new Date(date);
    const getHours = `${time.getHours()}`.padStart(2, "0");
    const getMin = `${time.getMinutes()}`.padStart(2, "0");
    return `${getHours}:${getMin} ${time.getHours() <= 11 ? "AM" : "PM"}`;
  };
  const { phoneViewport } = Viewport();
  const list = journals.map((story) => (
    <>
      <div className={cls.listStory} key={story.id}>
        <h3>
          {story ? `${dateFormat(story.timeon)} @` : ""}
          <p>{story ? ` ${timeFormat(story.timeon)}` : ""}</p>
        </h3>
        <article key={story.id} className={cls.listStoryArticle}>
          {story.message}
        </article>
        <div className={cls.listAction}>
          {item.view !== null && (
            <button
              data-docid={story.docId}
              onClick={pathFinder}
              data-identifier="view"
              data-id={story.id}
            >
              <div
                data-docid={story.docId}
                data-id={story.id}
                data-identifier="view"
                className={cls.icon}
              >
                <img
                  data-docid={story.docId}
                  data-id={story.id}
                  data-identifier="view"
                  src={viewImg}
                  alt="view"
                />
              </div>
            </button>
          )}
          <button
            data-identifier="edit"
            onClick={pathFinder}
            data-id={story.id}
            data-docid={story.docId}
          >
            <div
              className={cls.icon}
              data-id={story.id}
              data-identifier="edit"
              data-docid={story.docId}
            >
              <img
                src={editImg}
                data-docid={story.docId}
                data-id={story.id}
                data-identifier="edit"
                alt="edit"
              />
            </div>
          </button>
          <button
            data-docid={story.docId}
            data-identifier="delete"
            data-id={story.id}
            onClick={pathFinder}
          >
            <div
              className={cls.icon}
              data-identifier="delete"
              data-id={story.id}
              data-docid={story.docId}
            >
              <img
                src={deleteImg}
                data-identifier="delete"
                alt="delete"
                data-id={story.id}
                data-docid={story.docId}
              />
            </div>
          </button>
          <button
            onClick={pathFinder}
            data-identifier="archive"
            data-id={story.id}
          >
            <div
              className={cls.icon}
              data-identifier="archive"
              data-id={story.id}
              data-docid={story.docId}
            >
              <img
                src={arcImg || archivedImg}
                data-docid={story.docId}
                alt="archive"
                data-identifier="archive"
                data-id={story.id}
              />
            </div>
          </button>
        </div>
      </div>
    </>
  ));
  return (
    <>
      {phoneViewport && <CreateJournal />}
      <JournalNav />
      <div className={cls.JournalList}>
        {!phoneViewport && (
          <ViewItem toggled={item.showView} show={item.view} id={id} />
        )}
        {!phoneViewport && list}

        {item.view && phoneViewport && (
          <ViewItem toggled={item.showView} show={item.view} id={id} />
        )}
        {!item.view && phoneViewport && list}

        {journals.length <= 0 && (
          <h2 className={cls.emptyJournal}>No Journal Available</h2>
        )}
      </div>
    </>
  );
};
export default JournalList;
