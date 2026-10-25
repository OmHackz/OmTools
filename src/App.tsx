import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./routes/Home";
import { SectionPage } from "./routes/SectionPage";
import { ToolRoute } from "./routes/ToolRoute";
import { NotFound } from "./routes/NotFound";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="image" element={<SectionPage />} />
          <Route path="converter" element={<SectionPage />} />
          <Route path="developer" element={<SectionPage />} />
          <Route path="text" element={<SectionPage />} />
          <Route path="ai" element={<SectionPage />} />
          <Route path="tools/:toolId" element={<ToolRoute />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
