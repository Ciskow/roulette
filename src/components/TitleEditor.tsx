import React, { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import './TitleEditor.css';

interface TitleEditorProps {
    initialTitle: string;
    onSave: (newTitle: string) => void;
}

export const TitleEditor: React.FC<TitleEditorProps> = ({ initialTitle, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (title.trim()) {
            onSave(title.trim());
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setTitle(initialTitle);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="title-editor editing">
                <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="title-input"
                />
            </div>
        );
    }

    return (
        <div className="title-editor">
            <h1>{title}</h1>
            <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
                aria-label="Edit title"
            >
                <Pencil size={20} />
            </button>
        </div>
    );
};
