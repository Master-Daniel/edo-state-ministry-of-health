import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Wrap SweetAlert2 with React support
const swalSwal = withReactContent(Swal);

// Create a mixin with default configurations
export const swal = swalSwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showClass: {
        popup: 'swal2-fade',
        backdrop: 'swal2-noanimation',
    },
    hideClass: {
        popup: 'swal2-slide-up',
    },
});

interface SweetAlertWrapperProps {
    children: React.ReactNode;
}

const SweetAlertWrapper: React.FC<SweetAlertWrapperProps> = ({ children }) => {
    return <>{children}</>;
};

export default SweetAlertWrapper;
