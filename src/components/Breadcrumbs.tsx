import React from 'react';
import type { RouletteOption } from '../types';
import './Breadcrumbs.css';

interface BreadcrumbsProps {
    path: RouletteOption[];
    onNavigate: (id: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
                {path.map((node, index) => {
                    const isLast = index === path.length - 1;
                    return (
                        <li key={node.id}>
                            {index > 0 && <span className="separator">/</span>}
                            <button
                                className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                                onClick={() => onNavigate(node.id)}
                                disabled={isLast}
                                aria-current={isLast ? 'page' : undefined}
                            >
                                {node.label}
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
