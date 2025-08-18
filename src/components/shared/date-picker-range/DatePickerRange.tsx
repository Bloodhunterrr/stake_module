// import React, { useState, useRef, useEffect } from 'react';
// import {DateRangePicker} from "react-date-range";
// import { subDays } from 'date-fns';
//
// import CalendarIcon  from '@/assets/icons/calendar.svg?react';
// import ChevronDownIcon  from '@/assets/icons/arrow-down.svg?react';
import './style.css'

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  selectedDates?: DateRange;
  onChange: (dates: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholderStart?: string;
  placeholderEnd?: string;
  disabled?: boolean;
}

// eslint-disable-next-line no-empty-pattern
const DateRangePickerInput: React.FC<DateRangePickerProps> = ({
  // selectedDates = { startDate: null, endDate: null },
  // onChange,
  // minDate,
  // maxDate,
  // placeholderStart = "From date",
  // placeholderEnd = "To date",
  // disabled = false,
}) => {
  // const [state, setState] = useState([
  //   {
  //     startDate: selectedDates.startDate || subDays(new Date(), 7),
  //     endDate: selectedDates.endDate || new Date(),
  //     key: 'selection',
  //   },
  // ]);

  // const [open, setOpen] = useState(false);
  // const pickerRef = useRef<HTMLDivElement>(null);

  // const handleSelect = (ranges: unknown) => {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-expect-error
  //   const { selection } = ranges;
  //   setState([selection]);
  //
  //   const newRange = {
  //     startDate: selection.startDate,
  //     endDate: selection.endDate,
  //   };
  //
  //   onChange(newRange);
  // };

  // const handleClickOutside = (e: MouseEvent) => {
  //   if (
  //     pickerRef.current &&
  //     !pickerRef.current.contains(e.target as Node)
  //   ) {
  //     setOpen(false);
  //   }
  // };
  //
  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="m-datepicker-wrapper m-datepicker-wrapper--default">
      {/*<div onClick={() => setOpen(true)} className="m-datepicker m-datepicker-range" style={{ display: 'flex', gap: '10px' }}>*/}
      {/*  <div*/}
      {/*    className="m-input m-gradient-border m-input--basic m-input--s"*/}
      {/*    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}*/}
      {/*  >*/}
      {/*    <div className="m-icon-container m-input-prepend">*/}
      {/*      <CalendarIcon className="m-icon m-icon-loadable" />*/}
      {/*    </div>*/}
      {/*    <input*/}
      {/*      type="text"*/}
      {/*      value={state[0].startDate ? state[0].startDate.toLocaleDateString() : ''}*/}
      {/*      placeholder={placeholderStart}*/}
      {/*      readOnly*/}
      {/*      disabled={disabled}*/}
      {/*      className="m-input-content"*/}
      {/*      style={{ background: 'transparent', border: 'none', width: '100%', color: "var(--m-input-label-color)" }}*/}
      {/*    />*/}
      {/*    <div className="m-icon-container m-input-append">*/}
      {/*      <ChevronDownIcon />*/}
      {/*    </div>*/}
      {/*  </div>*/}

      {/*  <div*/}
      {/*    className="m-input m-gradient-border m-input--basic m-input--s"*/}
      {/*    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}*/}
      {/*  >*/}
      {/*    <div className="m-icon-container m-input-prepend">*/}
      {/*      <CalendarIcon className="m-icon m-icon-loadable" />*/}
      {/*    </div>*/}
      {/*    <input*/}
      {/*      type="text"*/}
      {/*      value={state[0].endDate ? state[0].endDate.toLocaleDateString() : ''}*/}
      {/*      placeholder={placeholderEnd}*/}
      {/*      readOnly*/}
      {/*      disabled={disabled}*/}
      {/*      className="m-input-content"*/}
      {/*      style={{ background: 'transparent', border: 'none', width: '100%', color: "var(--m-input-label-color)" }}*/}
      {/*    />*/}
      {/*    <div className="m-icon-container m-input-append">*/}
      {/*      <ChevronDownIcon />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*{open && (*/}
      {/*  <div ref={pickerRef} style={{position: "absolute", zIndex: 100}}>*/}
      {/*    <DateRangePicker*/}
      {/*      ranges={state}*/}
      {/*      onChange={handleSelect}*/}
      {/*      moveRangeOnFirstSelection={false}*/}
      {/*      minDate={minDate}*/}
      {/*      maxDate={maxDate}*/}
      {/*      direction="vertical"*/}
      {/*      inputRanges={[]}*/}
      {/*      rangeColors={['var(--color-pr500)']}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default DateRangePickerInput;