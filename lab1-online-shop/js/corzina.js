(function () {
    const STORAGE_KEY = 'coffespot_korzina_v1';

    class korzina {
        constructor(storageKey = STORAGE_KEY) {
            this._storageKey = storageKey;
            this._items = new Map();
        }

        static _toId(id){
            if (id == null) return null;
            const s = String(id).trim();
            return s.length ? s : null;
        }

        static _toQte(qte){
            if (qte == null) return null;
            const s = Number(qte);
            if (s < 0) return null;
            if (!Number.isFinite(s)) return null;
            return s;
        }

        static _toPrice(price){
            if (price == null) return null;
            const s = Number(price);
            if (!Number.isFinite(s)) return null;
            if (s < 0) return null;
            return s;
        }

        add(product, qte){
            if (!product || typeof product !== 'object' ) return null;

            const id = korzina._toId(product.id);
            const price = korzina._toPrice(product.price);
            const description = product.description;
            const title = product.title;
            const amt = korzina._toQte(qte);

            if (!id || !title || !amt || !description || !title || !price) return null;

            const existing = this._items.get(id);

            if (existing) {
                existing.qty += q
            }
        }

        window.korzina1 = new korzina();
    }
})