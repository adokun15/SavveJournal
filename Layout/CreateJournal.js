import { useState } from "react";
import cls from "./CreateJournal.module.css";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../FireApp";
import { useParams } from "react-router-dom";
const CreateJournal = () => {
  const [isOpened, setIsOpened] = useState(false);
  const user = useSelector((state) => state.reducer);
  const [mes, setMes] = useState("Enter Journal Message...");

  const param = useParams();

  const sendData = () => {
    //Send data to Api Later
    const idMaker = () => `${Math.trunc(Math.random() * 100000000)}`;
    const timeon = new Date();

    const docId = user.docId;

    if (!docId) return;
    const docRef = doc(db, "JournalUsers", docId);

    const listOfJournal = [
      {
        id: idMaker(),
        timeon: timeon.toISOString(),
        archive: false,
        docId: docId,
        message: mes,
      },
      ...user.journals,
    ];
    const info = { journals: listOfJournal };
    if (user.username) updateDoc(docRef, info).catch((e) => console.log(e));
    setIsOpened(false);
    setMes("Enter new message...");
  };
  return (
    <div className={cls.CreateContainer}>
      {isOpened && (
        <>
          <h2>Add to Journal</h2>
          <textarea
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className={cls.CreateContainerTextArea}
          ></textarea>

          <button
            disabled={!user.username || param.JournalId}
            className={cls.CreateContainerBtn}
            onClick={sendData}
          >
            Add
          </button>
        </>
      )}
      {!isOpened && (
        <button
          disabled={!user.username}
          className={cls.CreateContainerBtn}
          onClick={() => setIsOpened(true)}
        >
          Create journal
        </button>
      )}
    </div>
  );
};
export default CreateJournal;
