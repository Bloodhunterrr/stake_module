import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import  CloseBtn  from "@/assets/icons/close.svg?react"
import './styles.css'
import { useIsDesktop } from "@/hooks/useIsDesktop";
import  ArrowLeftIcon  from '@/assets/icons/arrow-left.svg?react'


const modalRoot = document.getElementById("modal-root") as HTMLElement;

type ModalProps = {
  children: ReactNode;
  title: ReactNode | null;
  onClose: () => void;
  width?: number;
  maxWidth?: number;
  additionalClass?: string;
  showArrowLeft?: boolean
};

function Modal({ children, title, onClose, width = 400, maxWidth = 1608, additionalClass = "", showArrowLeft = false }: ModalProps) {
  const isTabledOrDesktop = useIsDesktop(700)
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) elRef.current = document.createElement("div");


  useEffect(() => {
    const el = elRef.current!;
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  return createPortal(
    <div id="m-modal-wrapper">
      <div className="m-modal" >
        <div className={`m-modal-overlay ${additionalClass}`} onClick={(e: any) => {
          e.stopPropagation()
          onClose()
        }} />
        <div
          className={`m-modal-container ${additionalClass}`}
          style={{ width: isTabledOrDesktop ? width : 'calc(100% - 30px)', maxWidth }}
        >
          <div className="m-modal-header">
            {showArrowLeft && <div
              onClick={(e: any) => {
                e.stopPropagation()
                onClose()
              }} className="m-modal-header-left">
              <button
                className="m-button-nav m-button-nav--transparent m-button-nav--ArrowLeft m-button-nav--s m-gradient-border"
                data-qa="button-ArrowLeft"
              >
                <ArrowLeftIcon className="m-icon m-icon-loadable" />
              </button>
            </div>}

            <div style={showArrowLeft ? { justifyContent: 'center' } : {}} className="m-modal-header-content">{title}</div>
            <div>
              <button
                onClick={(e: any) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="m-button-nav m-button-nav--secondary m-button-nav--DismissClose m-button-nav--s m-gradient-border"
                data-qa="button-DismissClose"
              >
                <CloseBtn />
              </button>
            </div>
          </div>
          <div className="m-modal-scrollable m-thin-scrollbar">
            <div className="m-modal-content">{children}</div>
          </div>
        </div>
      </div>
    </div>,
    elRef.current
  );
}

export default Modal;
