import loaderCss from "./loader.module.css";
import loader from "../Asset/icons8-loading-48.png";
const LoaderBody = () => {
  return (
    <div className={loaderCss.LoaderBody}>
      <div className={loaderCss.Loader_img_container}>
        <img src={loader} alt="loader" />
      </div>
    </div>
  );
};
export default LoaderBody;
