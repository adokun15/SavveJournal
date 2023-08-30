import { useNavigate, useParams } from "react-router-dom";
import cls from "./EditJournal.module.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../FireApp";
const EditJournal = () => {
  const param = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.reducer);
  const currentJournal = user.journals.find((u) => param.JournalId === u.id);
  const [newmessage, setMessage] = useState("");

  useEffect(() => {
    setMessage(currentJournal ? currentJournal.message : "");
  }, [currentJournal]);
  const updateMessage = (e) => {
    e.preventDefault();
    const journal = user.journals.find(
      (journal) => journal.id === param.JournalId
    );
    const othersjournal = user.journals.filter(
      (journal) => journal.id !== param.JournalId
    );

    const { id, docId, archive } = journal;
    const timeon = new Date();

    const docRef = doc(db, "JournalUsers", journal.docId);

    const currentJournal = [
      {
        id,
        timeon: timeon.toISOString(),
        docId,
        archive,
        message: newmessage,
      },
      ...othersjournal,
    ];

    const info = { journals: currentJournal };

    //  let journals=user.find()
    updateDoc(docRef, info);

    return navigate(`/${user.id}`);
  };

  const HomeNav = () => {
    navigate("..");
  };
  return (
    <div className={cls.EditJournal}>
      <div className={cls.JournalHeader}>
        <h2>Edit Journal</h2>
        <button onClick={HomeNav}>Home</button>
      </div>
      <form onSubmit={updateMessage} className={cls.EditForm}>
        <textarea
          name="edit"
          className={cls.changeText}
          value={newmessage}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit" className={cls.EditFormBtn}>
          Save
        </button>
      </form>
    </div>
  );
};
export default EditJournal;
