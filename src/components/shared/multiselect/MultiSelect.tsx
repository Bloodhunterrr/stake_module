import React, { useState, useEffect, useRef } from "react";
import CheckMarkIcon  from '@/assets/icons/check-mark.svg?react';
import ArrowUpIcon  from '@/assets/icons/arrow-up.svg?react';
import ArrowDownIcon  from '@/assets/icons/arrow-down.svg?react';

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    SvgIcon: React.FunctionComponent,
    options: Option[];
    selected: string[];
    onChange: (selectedValues: string[]) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    SvgIcon,
    options,
    selected = [],
    onChange,
    placeholder = "Select...",
    label = "",
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        if (!disabled) setIsOpen((prev) => !prev);
    };

    const handleOptionClick = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const renderSelectedLabels = () => {
        if (selected.length === 0) return <span className="m-input-content-label">{placeholder}</span>;

        const selectedOptions = options.filter((opt) => selected.includes(opt.value));
        if (selectedOptions.length === 1) {
            return <span className="m-input-content-label">{selectedOptions[0].label}</span>;
        }

        return (
            <span className="m-input-content-label">
                {selectedOptions.length} selected
            </span>
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={`m-dropdown m-combobox ${disabled ? "is-disabled" : ""}`}>
            <div className="m-dropdown-activator" onClick={handleToggle}>
                <div
                    className="m-input m-gradient-border m-input--basic m-input--s"
                >
                    <div className="m-input-prepend">
                        <SvgIcon />
                    </div>

                    <div className="m-input-content">
                        <input
                            type="text"
                            readOnly
                            disabled={disabled}
                            placeholder=""
                            aria-label={label || placeholder}
                        />
                        {renderSelectedLabels()}
                    </div>

                    <div className="m-input-append">
                        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </div>
                </div>
            </div>

            {isOpen && !disabled && (
                <div ref={dropdownRef} className="m-dropdown-content m-combobox-dropdown" style={{ width: "200px", opacity: 1 }}>
                    <div className="m-combobox-content">
                        {options.map((option) => (<>
                            <div key={option.value}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleOptionClick(option.value)
                                }}
                                className="m-form-field m-combobox-row"
                            >
                                <label className="m-form-field-label" >{option.label}</label>
                                <label className={`m-checkbox m-checkbox--primary m-checkbox--m ${selected.includes(option.value) && 'm-checkbox--checked'}`}>
                                    <input type="checkbox" data-qa="checkbox" disabled />
                                    <div className="m-checkbox-checkmark">
                                        {selected.includes(option.value) && <CheckMarkIcon className="m-icon m-icon-loadable" />}
                                    </div>
                                </label>
                            </div>
                        </>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;