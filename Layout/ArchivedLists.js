import { useSelector } from "react-redux";
import JournalList from "./JournalList";
import arcImg from "../Asset/icons8-archive-24.png";
import { useParams } from "react-router-dom";

const Archived = () => {
  const param = useParams();
  const user = useSelector((state) => state.reducer);
  const items = {
    view: null,
    showView: null,
    archive: true,
  };

  const journals = user.journals.filter(
    (journal) => journal.archive && user.id === param.id
  );

  return <JournalList item={items} arcImg={arcImg} journals={journals} />;
};
export default Archived;
