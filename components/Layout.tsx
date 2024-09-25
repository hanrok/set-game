import { useContext } from "react";
import Header from "@/components/partials/Header";
import Modal from "@/components/Modal";
import { Context, ContextValues } from "./Context";

interface ILayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const { nsets, addThreeCards } = useContext(Context) as ContextValues;

  const handleEventModal = () => addThreeCards();

  return <>
    <Header />
    <main>
      {children}
    </main>
    { nsets?.length === 0 && <Modal onClick={handleEventModal} /> }
  </>
};

export default Layout;
