import Toast from './Toast';
import { useToast } from '../query/Toast';

function NofiticationCenter() {
  // 상태를 추적합니다.
  const { data: toast } = useToast();
  return (
    <div className="notification-container top-right">
      {toast?.message && <Toast key={Math.random()} text={toast.message} dismissTime={2000} />}
    </div>
  );
}

export default NofiticationCenter     
