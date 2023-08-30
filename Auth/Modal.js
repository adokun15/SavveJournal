import Auth from "./AuthBody";
import cls from "./Modal.module.css";
const Modal = ({ close }) => {
  return (
    <div className={cls.modal}>
      <Auth close={close} />
    </div>
  );
};
export default Modal;
