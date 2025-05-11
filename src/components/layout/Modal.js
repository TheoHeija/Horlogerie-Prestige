import { Fragment, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Modal component - Renders a modal dialog with luxury styling
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {ReactNode} props.children - Content to render inside the modal
 * @param {string} props.title - Modal title
 * @param {ReactNode} props.footer - Footer content (typically buttons)
 * @param {string} props.size - Modal size (sm, md, lg, xl, full)
 * @param {boolean} props.closeOnClickOutside - Whether to close the modal when clicking outside
 * @param {string} props.className - Additional class names
 * @param {boolean} props.showCloseButton - Whether to show the close button
 */
const Modal = ({
    isOpen,
    onClose,
    children,
    title,
    footer,
    size = 'md',
    closeOnClickOutside = true,
    className = '',
    showCloseButton = true,
}) => {
    const cancelButtonRef = useRef(null);

    // Handle escape key to close the modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Determine modal width based on size prop
    const getModalWidth = () => {
        switch (size) {
            case 'sm':
                return 'max-w-sm';
            case 'md':
                return 'max-w-md';
            case 'lg':
                return 'max-w-lg';
            case 'xl':
                return 'max-w-xl';
            case '2xl':
                return 'max-w-2xl';
            case '3xl':
                return 'max-w-3xl';
            case '4xl':
                return 'max-w-4xl';
            case '5xl':
                return 'max-w-5xl';
            case 'full':
                return 'max-w-full mx-4';
            default:
                return 'max-w-md';
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                initialFocus={cancelButtonRef}
                onClose={closeOnClickOutside ? onClose : () => { }}
            >
                {/* Background overlay with animation */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md" />
                </Transition.Child>

                {/* Modal panel */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel
                                className={`w-full ${getModalWidth()} transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left align-middle shadow-2xl transition-all ring-1 ring-gray-200 dark:ring-gray-700 relative ${className}`}
                            >
                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-5 dark:opacity-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full text-indigo-500">
                                        <path fill="currentColor" d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm0-18c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z" />
                                    </svg>
                                </div>

                                {/* Modal header */}
                                {title && (
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-transparent to-indigo-50 dark:to-gray-800/30">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold text-gray-900 dark:text-white flex items-center"
                                        >
                                            {/* Small accent before title */}
                                            <div className="w-1 h-5 bg-indigo-500 dark:bg-indigo-400 rounded mr-3"></div>
                                            {title}
                                        </Dialog.Title>

                                        {showCloseButton && (
                                            <button
                                                type="button"
                                                className="p-1.5 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                                onClick={onClose}
                                                ref={cancelButtonRef}
                                                aria-label="Close modal"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Modal content with subtle pattern */}
                                <div className="px-8 py-6 overflow-y-auto max-h-[calc(100vh-200px)] bg-white dark:bg-gray-800">
                                    {children}
                                </div>

                                {/* Modal footer */}
                                {footer && (
                                    <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
                                        {footer}
                                    </div>
                                )}

                                {/* Luxury brand mark */}
                                <div className="absolute bottom-2 left-2 opacity-5 dark:opacity-10 pointer-events-none">
                                    <div className="text-xs font-serif tracking-wider">HORLOGERIE PRESTIGE</div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal; 