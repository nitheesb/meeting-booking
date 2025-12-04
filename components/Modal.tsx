
import React from 'react';
import { X } from 'lucide-react';
import { THEME } from '../constants';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose, title }) => (
  <div style={{
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
  }} onClick={onClose}>
    <div style={{
      backgroundColor: '#252525', width: '500px', maxWidth: '90%', borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', overflow: 'hidden', border: `1px solid ${THEME.border}`,
      display: 'flex', flexDirection: 'column'
    }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '24px', borderBottom: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 500, color: 'white' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '8px' }}>
          <X size={24} />
        </button>
      </div>
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  </div>
);
