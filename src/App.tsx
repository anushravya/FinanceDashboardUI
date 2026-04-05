import { FinanceProvider } from "./context/FinanceContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <DashboardPage />
      </FinanceProvider>
    </ThemeProvider>
  );
}
