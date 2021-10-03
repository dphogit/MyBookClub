import React from "react";
import { Option } from "../../../common/types";

interface Props<T> {
  options: Option<T>[];
}

const ModalSelectOptions = <T extends unknown>({ options }: Props<T>) => {
  return (
    <>
      {options.map((opt) => (
        <option key={opt.id} value={opt.value as string}>
          {opt.text}
        </option>
      ))}
    </>
  );
};

export default ModalSelectOptions;
