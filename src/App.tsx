import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import InventoryPage from './pages/InventoryPage'
import CRMPage from './pages/CRMPage'
import HRPage from './pages/HRPage'
import SalesPage from './pages/SalesPage'
import PurchasesPage from './pages/PurchasesPage'
import AccountingPage from './pages/AccountingPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/crm" element={<CRMPage />} />
                <Route path="/hr" element={<HRPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/accounting" element={<AccountingPage />} />
                {/* We will add more routes as we migrate pages */}
            </Routes>
        </Router>
    )
}

export default App
