import Layout from "@/components/Layout";
import GameBoard from "@/components/GameBoard";
import SetGameContext from "@/components/Context";

const App = () => {
  return (
    <SetGameContext>
      <Layout>
        <GameBoard />
      </Layout>
    </SetGameContext>
  );
}

export default App;
