import React, { useState, useEffect, useRef } from "react";
import CheckMarkIcon  from "@/assets/icons/check-mark.svg?react";
import ArrowUpIcon  from "@/assets/icons/arrow-up.svg?react";
import ArrowDownIcon  from "@/assets/icons/arrow-down.svg?react";
import useDebounce from "@/hooks/useDebounce";


export interface Option {
  image?: string;
  value: string;
  label: string;
}

interface SingleSelectAutocompleteProps {
  SvgIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  fetchOptions: (query: string) => Promise<Option[]>;
  selected: string | null;
  onChange: (selectedValue: string | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  isLoading: boolean;
}

const SingleSelectAutocomplete: React.FC<SingleSelectAutocompleteProps> = ({
  SvgIcon,
  fetchOptions,
  selected,
  onChange,
  placeholder = "Search...",
  label = "",
  disabled = false,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wasTypedRef = useRef(false);

  useDebounce(() => {
    if (!disabled && isOpen && wasTypedRef.current) {
      setDebouncedQuery(inputValue);
    }
    wasTypedRef.current = false;
  }, 500);

  useEffect(() => {
    if (!isOpen || disabled) return;

    const loadOptions = async () => {
      try {
        const query = debouncedQuery || "";
        const fetchedOptions = await fetchOptions(query);
        setOptions(fetchedOptions);
      } catch {
        setOptions([]);
      }
    };

    loadOptions();
  }, [debouncedQuery, isOpen, disabled, fetchOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowAll(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled) {
      setInputValue("");
      setOptions([]);
      setIsOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (wasTypedRef.current) return;

    if (!selected) {
      setInputValue("");
      return;
    }

    const selectedOption = options.find((opt) => opt.value === selected);
    setInputValue(selectedOption ? selectedOption.label : selected);
  }, [selected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    wasTypedRef.current = true;
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setShowAll(false);
      onChange(null);
    } else {
      setShowAll(true);
    }

    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setInputValue(option.label);
    setIsOpen(false);
    setShowAll(false);
  };

  const visibleOptions =
    !debouncedQuery && !showAll ? options.slice(0, 10) : options;

  return (
    <div className={`m-dropdown m-combobox ${disabled ? "is-disabled" : ""}`}>
      <div
        className="m-dropdown-activator"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <label className="m-form-field-label Amount_label_xnDQk">
          <div>Search Crypto</div>
        </label>
        <div className="m-input m-gradient-border m-input--dark m-input--m">
          <div className="m-input-prepend">
            <SvgIcon />
          </div>
          <div className="m-input-content">
            <input
              type="text"
              disabled={disabled}
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              aria-label={label || placeholder}
            />
          </div>
          <div className="m-input-append">
            {isLoading ? (
              <span>
                <div>Loading...</div>
              </span>
            ) : isOpen ? (
              <ArrowUpIcon />
            ) : (
              <ArrowDownIcon />
            )}
          </div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="m-dropdown-content m-combobox-dropdown"
          style={{
            opacity: 1,
            width: "100%",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <div className="m-combobox-content">
            {visibleOptions.length > 0 ? (
              <>
                {visibleOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className="m-form-field m-combobox-row"
                  >
                    {option.image && (
                      <img
                        width={30}
                        height={30}
                        src={option.image}
                        alt={option.label}
                      />
                    )}
                    <label className="m-form-field-label">{option.label}</label>
                    {selected === option.value && (
                      <CheckMarkIcon className="m-icon m-icon-loadable" />
                    )}
                  </div>
                ))}
                {!debouncedQuery && !showAll && options.length > 10 && (
                  <div
                    onClick={() => setShowAll(true)}
                    className="m-combobox-row m-combobox-view-more"
                    style={{
                      textAlign: "center",
                      cursor: "pointer",
                      fontWeight: 500,
                      padding: 6,
                    }}
                  >
                    <div>View more</div>
                  </div>
                )}
              </>
            ) : inputValue !== "" ? (
              <div className="m-combobox-row">
                <div>No results found</div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleSelectAutocomplete;