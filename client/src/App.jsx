import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import GalleryPage from "./pages/GalleryPage";
import ManagePage from "./pages/ManagePage";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./api";

function App () {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("gallery");
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products. Refresh in a minute."))
      .finally(() => setLoading(false));
  }, []);

  const saveProduct = async (data) => {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct._id, data);
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? updated : p))
      );
      setEditingProduct(null);
    } else {
      const created = await createProduct(data);
      setProducts((prev) => [created, ...prev]);
    }
  };

  const removeProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (editingProduct?._id === id) setEditingProduct(null);
    } catch {
      setError("Could not delete the product.");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo({top:0, behavior:"smooth"});
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar view={view} onChangeView={setView}/>

      {error && (
        <div className="mx-auto mt-6 max-w-6xl px-6 text-red-600">{error}</div>
      )}

      {view === "gallery" ? (
      <GalleryPage products={products} loading={loading} />
      ) : (
        <ManagePage
        products={products}
        editingProduct={editingProduct}
        onSave={saveProduct}
        onCancel={() => setEditingProduct(null)}
        onEdit={startEdit}
        onDelete={removeProduct}
/>
      )}

      <footer className="py-10 text-center text-sm text-slate-400">
        Made by [Andrei Daniel Tupas] · [Inf 233]
      </footer>
    </div>
  );
}

export default App;
