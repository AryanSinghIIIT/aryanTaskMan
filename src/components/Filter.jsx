// src/Modal.js
import React, { useState } from 'react';
import './Filter.css'; // For basic styling

const Filter = ({ isOpen, onClose, handleFilterChange }) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Filter by task title</h2>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter something..."
                />
                <button onClick={()=>handleFilterChange(inputValue, true)}>Submit</button>
            </div>
        </div>
    );
};

export default Filter;