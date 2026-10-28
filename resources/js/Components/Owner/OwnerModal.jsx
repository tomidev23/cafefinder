import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { X } from 'lucide-react';

const widths = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
};

export default function OwnerModal({
    show,
    onClose,
    title,
    description,
    children,
    maxWidth = 'lg',
}) {
    return (
        <Transition show={show} leave="duration-150">
            <Dialog
                as="div"
                className="relative z-60"
                onClose={onClose}
                aria-label={title}
            >
                <TransitionChild
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[#1C160F]/45 backdrop-blur-[2px]" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
                    <div className="flex min-h-full items-center justify-center">
                        <TransitionChild
                            enter="ease-out duration-200"
                            enterFrom="translate-y-2 opacity-0 sm:scale-95"
                            enterTo="translate-y-0 opacity-100 sm:scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="translate-y-0 opacity-100 sm:scale-100"
                            leaveTo="translate-y-2 opacity-0 sm:scale-95"
                        >
                            <DialogPanel
                                className={`w-full overflow-hidden rounded-2xl border border-[#EAE7EE] bg-white shadow-2xl shadow-[#241A10]/20 transition ${widths[maxWidth]}`}
                            >
                                <div className="flex items-start justify-between gap-4 border-b border-[#F0EFF4] px-5 py-4">
                                    <div>
                                        <DialogTitle className="text-[17px] font-semibold tracking-[-0.02em] text-[#211D29]">
                                            {title}
                                        </DialogTitle>
                                        {description && (
                                            <p className="mt-1 text-[11.5px] leading-5 text-[#77727F]">
                                                {description}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        aria-label="Close dialog"
                                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6F6A78] transition hover:bg-[#F5F4F8] hover:text-[#211D29] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D4B00]"
                                    >
                                        <X aria-hidden="true" className="h-4 w-4" />
                                    </button>
                                </div>

                                {children}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
