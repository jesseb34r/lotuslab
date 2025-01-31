import { ImportListComponent } from "./components/import_list";
import HomePage from "./pages/home_page";

function App() {
  return (
    <main
      id="main"
      class="flex flex-col items-center min-h-screen justify-center bg-gray-app p-20 text-gray-normal"
    >
      <HomePage />
    </main>
  );
}

export default App;
