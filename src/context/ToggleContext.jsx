import { createContext, useContext } from "react";

export const ToggleContext = createContext();

export function useToggle() {
  return useContext(ToggleContext);
}
