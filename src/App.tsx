import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { DesignSystem } from "@/pages/DesignSystem";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="design" element={<DesignSystem />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
