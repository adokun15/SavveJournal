import { useState } from "react";
import { useSelector } from "react-redux";
import JournalList from "./JournalList";
import { useParams } from "react-router-dom";
const JournalItem = () => {
  const param = useParams();
  const [view, showView] = useState(false);

  const items = {
    archive: false,
    view: view,
    showView: () => showView((bool) => !bool),
  };

  const user = useSelector((state) => state.reducer);

  const journals = user.journals.filter(
    (journal) => !journal.archive && user.id === param.id
  );

  return <JournalList item={items} journals={journals} />;
};
export default JournalItem;
