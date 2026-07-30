import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sampleCart = [
  { id: 1, nama: "Wisata Lawang Sewu", harga: 15000, qty: 2 },
  { id: 2, nama: "Museum Ronggowarsito", harga: 10000, qty: 1 },
];

export default function KeranjangPage() {
  const [items, setItems] = useState(sampleCart);
  const [promoCode, setPromoCode] = useState("");

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const discount = promoCode === "DISKON10" ? total * 0.1 : 0;
  const finalTotal = total - discount;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Keranjang Belanja
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-card rounded-2xl border border-border p-6 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.nama}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <div className="text-right mr-6">
                        <p className="font-bold text-primary">
                          Rp {(item.harga * item.qty).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Keranjang Anda kosong
                    </p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {items.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-6 h-fit">
                  <h3 className="font-bold text-foreground mb-6">
                    Ringkasan Pesanan
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">
                        Rp {total.toLocaleString()}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Diskon</span>
                        <span>-Rp {discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Kode Promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full px-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Coba: DISKON10
                    </p>
                  </div>

                  <div className="border-t border-border pt-6 mb-6">
                    <div className="flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-primary text-lg">
                        Rp {finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    Lanjut ke Pembayaran
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
