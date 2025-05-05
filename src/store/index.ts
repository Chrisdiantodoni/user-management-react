import { create } from "zustand";

type ModalState = {
  modalDeleteUser: boolean;
  modalUser: boolean;
  modalResetPassword: boolean;
  modalChangePassword: boolean;
};

type StoreState = {
  isAuthenticated: boolean;
  title: string;
  isDragDisabled: boolean;
  modal: ModalState;
  modalItem?: any;
  userData: Record<string, any>;

  handle: <K extends keyof StoreState>(name: K, value: StoreState[K]) => void;
  handleModal: (name: keyof ModalState, value: boolean, items?: any) => void;
};

const initialModalState: ModalState = {
  modalDeleteUser: false,
  modalResetPassword: false,
  modalUser: false,
  modalChangePassword: false,
};

const useStore = create<StoreState>((set) => ({
  isAuthenticated: false,
  title: "",
  isDragDisabled: false,
  modal: initialModalState,
  userData: {},
  handle: (name, value) =>
    set((state) => ({
      ...state,
      [name]: value,
    })),
  handleModal: (name, value, items) =>
    set((state) => ({
      ...state,
      modal: {
        ...state.modal,
        [name]: value,
      },
      modalItem: items,
    })),
}));

export default useStore;
