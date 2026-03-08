import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Image,
  FileText,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import paperService from '../services/paperService';

const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  submitted: { label: 'Proof Submitted', variant: 'info', icon: Upload },
  verified: { label: 'Verified', variant: 'success', icon: CheckCircle },
  rejected: { label: 'Rejected', variant: 'error', icon: XCircle },
};

export default function Payment() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [verifyNotes, setVerifyNotes] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [paperData, paymentData] = await Promise.all([
          paperService.getPaper(id),
          paperService.getPayment(id),
        ]);
        setPaper(paperData);
        setPayment(paymentData);
      } catch (err) {
        console.error('Failed to load payment data:', err);
        if (err.response?.status === 404) {
          toast.error('Payment record not found');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile || !transactionId.trim()) {
      toast.error('Please provide both payment proof and transaction ID');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('payment_proof', proofFile);
      formData.append('transaction_id', transactionId);
      const updated = await paperService.uploadPaymentProof(id, formData);
      setPayment(updated);
      toast.success('Payment proof uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to upload proof');
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = async (action) => {
    setVerifying(true);
    try {
      const updated = await paperService.verifyPayment(id, action, verifyNotes);
      setPayment(updated);
      toast.success(
        action === 'verify'
          ? 'Payment verified successfully!'
          : 'Payment rejected.'
      );
      if (action === 'verify') {
        // Refresh paper data to get updated status
        const updatedPaper = await paperService.getPaper(id);
        setPaper(updatedPaper);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Action failed');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!payment || !paper) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-text mb-4">Payment Not Found</h2>
        <p className="text-text-muted mb-6">
          No payment record exists for this paper.
        </p>
        <Link to="/dashboard">
          <Button icon={ArrowLeft}>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const statusConfig = PAYMENT_STATUS_CONFIG[payment.status] || PAYMENT_STATUS_CONFIG.pending;
  const isOwner = paper.submitted_by?.id === user?.id;
  const isEditor = user?.role === 'editor' || user?.role === 'admin';
  const canUpload = isOwner && (payment.status === 'pending' || payment.status === 'rejected');
  const canVerify = isEditor && payment.status === 'submitted';

  return (
    <div className="min-h-screen bg-surface-light py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          to={`/papers/${id}`}
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Paper
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">
              Payment for Paper
            </h1>
            <p className="text-text-muted line-clamp-1">{paper.title}</p>
            <div className="mt-3">
              <Badge variant={statusConfig.variant}>
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Payment Info Card */}
          <Card hover={false} className="p-6 mb-6">
            <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Amount</p>
                <p className="text-2xl font-bold text-google-blue">
                  ₹{parseFloat(payment.amount).toFixed(2)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">UPI Number</p>
                <p className="text-2xl font-bold text-text">
                  {payment.upi_number}
                </p>
              </div>
            </div>
          </Card>

          {/* QR / UPI Payment Instructions */}
          {canUpload && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-google-green" />
                How to Pay
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-google-blue/5 border border-google-blue/20">
                  <p className="text-sm text-text mb-3">
                    Send <strong>₹{parseFloat(payment.amount).toFixed(2)}</strong> to the following PhonePe number:
                  </p>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-border">
                    <div className="w-12 h-12 rounded-full bg-google-blue/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-google-blue" />
                    </div>
                    <div>
                      <p className="font-bold text-text text-lg">{payment.upi_number}</p>
                      <p className="text-xs text-text-muted">PhonePe / UPI</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="w-6 h-6 rounded-full bg-google-blue text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <p className="text-sm text-text">Open PhonePe, Google Pay, or any UPI app</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="w-6 h-6 rounded-full bg-google-red text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <p className="text-sm text-text">Send ₹{parseFloat(payment.amount).toFixed(2)} to <strong>{payment.upi_number}</strong></p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="w-6 h-6 rounded-full bg-google-yellow text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <p className="text-sm text-text">Take a screenshot of the payment confirmation</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <span className="w-6 h-6 rounded-full bg-google-green text-white flex items-center justify-center text-xs font-bold shrink-0">4</span>
                    <p className="text-sm text-text">Upload the screenshot and enter the transaction ID below</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Upload Proof Form */}
          {canUpload && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-google-red" />
                Upload Payment Proof
              </h3>
              {payment.status === 'rejected' && payment.notes && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-4">
                  <p className="text-sm text-red-700">
                    <strong>Rejection reason:</strong> {payment.notes}
                  </p>
                  <p className="text-sm text-red-600 mt-1">Please re-upload valid payment proof.</p>
                </div>
              )}
              <form onSubmit={handleUploadProof} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">
                    Payment Screenshot <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                      proofFile
                        ? 'border-google-green bg-green-50'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ position: 'relative' }}
                    />
                    {proofFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <Image className="w-6 h-6 text-google-green" />
                        <span className="font-medium text-text">{proofFile.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProofFile(null);
                          }}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image className="w-8 h-8 text-text-muted mx-auto" />
                        <p className="text-sm text-text-muted">Click to upload payment screenshot</p>
                      </div>
                    )}
                  </div>
                </div>

                <Input
                  label="Transaction ID"
                  placeholder="Enter UPI transaction ID / UTR number"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  icon={Upload}
                  loading={uploading}
                  disabled={!proofFile || !transactionId.trim()}
                >
                  Upload Payment Proof
                </Button>
              </form>
            </Card>
          )}

          {/* Proof Already Submitted */}
          {payment.status === 'submitted' && isOwner && (
            <Card hover={false} className="p-6 mb-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-google-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-google-blue" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2">Payment Proof Submitted</h3>
                <p className="text-text-muted mb-2">
                  Your payment proof is under review. You will be notified once it is verified.
                </p>
                {payment.transaction_id && (
                  <p className="text-sm text-text-muted">
                    Transaction ID: <strong>{payment.transaction_id}</strong>
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Verified */}
          {payment.status === 'verified' && (
            <Card hover={false} className="p-6 mb-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-google-green/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-google-green" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2">Payment Verified</h3>
                <p className="text-text-muted mb-2">
                  Your payment has been verified. Your paper will now proceed to review.
                </p>
                {payment.verified_at && (
                  <p className="text-xs text-text-muted">
                    Verified on {new Date(payment.verified_at).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                )}
              </div>
              <div className="text-center mt-4">
                <Link to="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Editor Verification Panel */}
          {canVerify && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-google-blue" />
                Verify Payment
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Transaction ID</p>
                    <p className="font-bold text-text">{payment.transaction_id || 'N/A'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Amount</p>
                    <p className="font-bold text-text">₹{parseFloat(payment.amount).toFixed(2)}</p>
                  </div>
                </div>

                {payment.payment_proof && (
                  <div>
                    <p className="text-sm font-medium text-text-muted mb-2">Payment Proof:</p>
                    <a
                      href={payment.payment_proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Image className="w-4 h-4" />
                      View Payment Screenshot
                    </a>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">
                    Notes (optional)
                  </label>
                  <textarea
                    value={verifyNotes}
                    onChange={(e) => setVerifyNotes(e.target.value)}
                    placeholder="Add notes about this payment verification..."
                    rows={3}
                    className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text placeholder:text-text-muted/50 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleVerify('verify')}
                    loading={verifying}
                    className="bg-google-green hover:bg-google-green/90"
                  >
                    Verify Payment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleVerify('reject')}
                    loading={verifying}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Reject Payment
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
