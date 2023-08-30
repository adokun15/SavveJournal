import cls from "./ViewItem.module.css";
import { useSelector } from "react-redux";

const ViewItem = ({ id, toggled, show }) => {
  const user = useSelector((state) => state.reducer);
  const userJournalMessage = user.journals.find((journal) => journal.id === id);

  return (
    <>
      {show && (
        <div className={cls.view}>
          <p>{userJournalMessage ? userJournalMessage.message : ""}</p>
          <button onClick={toggled}>go back</button>
        </div>
      )}
    </>
  );
};
export default ViewItem;
