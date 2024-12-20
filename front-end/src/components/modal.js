import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000]">
      <div className="bg-purpleLight text-purpleDark p-4 md:p-6 rounded-lg shadow-lg w-11/12 sm:w-96 z-[10001] max-w-md"
      onClick={(e) => e.stopPropagation()} >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-purpleDark">{title}</h3>
          <button onClick={onClose} 
          className="text-purpleDarker">X</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
