import { Form, NavLink, useParams } from "react-router-dom";
import cls from "./JournalNav.module.css";
const JournalNav = () => {
  const paramId = useParams();
  return (
    <nav className={cls.JournalNav}>
      <li>
        <NavLink
          to={`/${paramId.id}`}
          className={({ isActive }) => (isActive ? cls.active : undefined)}
          end
        >
          Journals
        </NavLink>
      </li>
      <li>
        <NavLink
          to={`/${paramId.id}/archived`}
          className={({ isActive }) => (isActive ? cls.active : undefined)}
        >
          Archived
        </NavLink>
      </li>
      <li>
        <Form action="/logout" method="post">
          <button className={cls.logout} type="submit">
            logout
          </button>
        </Form>
      </li>
    </nav>
  );
};
export default JournalNav;
