import { useStore } from "@/stores";
// import { Toast } from "react-bootstrap";
import styles from "@/assets/css/Toast.module.css"
import { Alert } from "@/components/base/index.mjs";
import {BsCheckCircle} from 'react-icons/bs'
import {AiOutlineCloseCircle} from 'react-icons/ai'

function Toast() {
    //const [state, dispatch, toast, showToast] = useStore();
    const { toast } = useStore();
    console.log("toast: ", toast);
    return (
        <div>
            {toast && (               
                <Alert
                    className={styles.toast}
                    message={toast.type == "success" ? "Thành công" : "Thất bại"}
                    description={toast.message}
                    type={toast.type}
                    showIcon
                    closable
                />
            )}
        </div>
    )
};

export default Toast;