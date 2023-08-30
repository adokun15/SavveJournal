import { useSelector } from "react-redux";

const JournalHeader = ({ cls }) => {
  const user = useSelector((state) => state.reducer);
  return (
    <nav className={cls}>
      <h1>SavveJournal.</h1>
      {user.username && <h1>Welcome {user.username}</h1>}
    </nav>
  );
};
export default JournalHeader;
