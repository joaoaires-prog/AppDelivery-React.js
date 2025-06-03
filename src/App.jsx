import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import AppRoutesContent from "./Routes/Index";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutesContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
