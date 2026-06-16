import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/axios";

const PaymentProofModal = ({ consultation, onClose, onSuccess }) => {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!paymentUrl.trim()) {
      toast.error("Masukkan URL bukti pembayaran");
      return;
    }

    setLoading(true);
    try {
      await api.post("/consultations/upload-payment", {
        consultation_id: consultation.id,
        payment_proof_url: paymentUrl,
      });
      toast.success("Bukti pembayaran terkirim! Menunggu verifikasi admin.");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Gagal mengirim bukti pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">📸</div>
          <h3 className="text-xl font-bold">Upload Bukti Transfer</h3>
          <p className="text-sm text-gray-500 mt-1">
            Transfer ke rekening: <br />
            <span className="font-bold">BCA - 1234567890</span>
            <br />
            a.n. PT Counsela Indonesia
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Upload bukti transfer ke Google Drive / Imgur,
            <br /> lalu paste URL-nya di sini
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">URL Bukti Transfer</label>
          <input
            type="text"
            value={paymentUrl}
            onChange={(e) => setPaymentUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full p-3 border rounded-xl dark:bg-gray-700"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Mengirim..." : "Kirim Bukti"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 py-3 rounded-xl"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentProofModal;