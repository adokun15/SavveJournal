import loaderCss from "./loader.module.css";
import loader from "../Asset/icons8-loading-30.png";
const LoaderBtn = () => {
  return (
    <div className={loaderCss.spinner}>
      <img src={loader} alt="loader" />
    </div>
  );
};
export default LoaderBtn;
