import React, { useEffect, useRef } from 'react';
import './InfoModal.css';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    visitCount: number;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, visitCount }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="info-modal-overlay">
            <div ref={modalRef} className="info-modal">
                <div className="info-modal-content">
                    <div className="info-item">
                        <strong>QQ:</strong>
                        <span>1686448912</span>
                    </div>
                    <div className="info-item">
                        <strong>邮箱:</strong>
                        <span>dachen04@163.com</span>
                    </div>
                    <div className="info-item">
                        <strong>页面访问次数:</strong>
                        <span>{visitCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;