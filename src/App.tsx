
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboardV2 from './components/AdminDashboardV2';
import AdminDashboardPremium from './components/AdminDashboard/AdminDashboardPremium';
import MerchantDashboard from './components/MerchantDashboard';
import ViewerDashboard from './components/ViewerDashboard';
import AccountantDashboard from './components/AccountantDashboard';
import PayInPremium from './components/PaymentGateway/PayInPremium';
import PayOutPremium from './components/PaymentGateway/PayOutPremium';
import AccountSettingsPremium from './components/AccountSettings/AccountSettingsPremium';
import TransactionHistoryPremium from './components/TransactionHistory/TransactionHistoryPremium';
import CardManagementPremium from './components/CardManagement/CardManagementPremium';
import BeneficiaryManagementPremium from './components/BeneficiaryManagement/BeneficiaryManagementPremium';
import ReceiptGenerationPremium from './components/InvoiceReceipt/ReceiptGenerationPremium';
import NotificationsCenterPremium from './components/Notifications/NotificationsCenterPremium';
import SupportChatPremium from './components/Support/SupportChatPremium';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Login />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/pending" element={<PendingApproval />} /> */}

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Default route - landing page after login */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Generic dashboard - fallback */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Role-specific dashboards */}
          <Route path="/admin/dashboard" element={<AdminDashboardV2 />} />
          <Route path="/admin/dashboard/premium" element={<AdminDashboardPremium />} />
          <Route path="/admin/users" element={<AdminDashboardV2 />} />
          <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
          <Route path="/viewer/dashboard" element={<ViewerDashboard />} />
          <Route path="/accountant/dashboard" element={<AccountantDashboard />} />
          
          {/* Payment Gateway Routes */}
          <Route path="/payin" element={<PayInPremium />} />
          <Route path="/payout" element={<PayOutPremium />} />
          
          {/* Account Management */}
          <Route path="/account-settings" element={<AccountSettingsPremium />} />
          <Route path="/settings" element={<AccountSettingsPremium />} />
          
          {/* Transaction Management */}
          <Route path="/transactions" element={<TransactionHistoryPremium />} />
          <Route path="/transaction-history" element={<TransactionHistoryPremium />} />
          
          {/* Card Management */}
          <Route path="/cards" element={<CardManagementPremium />} />
          <Route path="/card-management" element={<CardManagementPremium />} />
          
          {/* Beneficiary Management */}
          <Route path="/beneficiaries" element={<BeneficiaryManagementPremium />} />
          <Route path="/beneficiary-management" element={<BeneficiaryManagementPremium />} />
          
          {/* Receipt/Invoice Generation */}
          <Route path="/receipts" element={<ReceiptGenerationPremium />} />
          <Route path="/invoices" element={<ReceiptGenerationPremium />} />
          <Route path="/receipt-generation" element={<ReceiptGenerationPremium />} />
          
          {/* Notifications Center */}
          <Route path="/notifications" element={<NotificationsCenterPremium />} />
          
          {/* Support & Chat */}
          <Route path="/support" element={<SupportChatPremium />} />
          <Route path="/help" element={<SupportChatPremium />} />
          <Route path="/chat" element={<SupportChatPremium />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
