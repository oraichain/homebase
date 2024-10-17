import { ReactNode } from 'react';

export type InputRangeType = {
  max?: number;
  min?: number;
  className: string;
  value: number;
  onChange: (val) => void;
  suffix?: ReactNode;
  showValue?: boolean;
};

const InputRange = ({
  showValue = true,
  max = 25,
  min = 1,
  className,
  value,
  onChange,
  suffix = '%'
}: InputRangeType) => {
  const progress = (100 * value) / max;
  return (
    <div className={className}>
      <input
        type="range"
        onChange={(e) => {
          e.preventDefault();
          const value = e?.target?.value;
          onChange(value);
        }}
        value={value}
        min={min}
        max={max}
        style={{
          background: `linear-gradient(to right, rgb(155 138 227) ${progress}%, #EFEFEF ${progress}%)`
        }}
      ></input>
      {showValue ? (
        <div>
          {value}
          {suffix}
        </div>
      ) : (
        <div>{suffix}</div>
      )}
    </div>
  );
};

export default InputRange;
