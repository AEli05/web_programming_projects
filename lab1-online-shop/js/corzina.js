(function () {
    const STORAGE_KEY = 'coffespot_korzina_v1';

    class Korzina {
        constructor(storageKey = STORAGE_KEY) {
            this._storageKey = storageKey;
            this._items = new Map();
        }

        static _toId(id){
            if (id == null) return null;
            const s = String(id).trim();
            return s.length ? s : null;
        }

        static _toAmt(qte){
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

        add(product, amt=1){
            if (!product || typeof product !== 'object' ) return null;

            const id = Korzina._toId(product.productId);
            const price = Korzina._toPrice(product.productPrice);
            const description = product.productDescription;
            const title = product.productTitle;
            const amount = Korzina._toAmt(amt);

            if (!id || !title || !amt || !description || !title || !price || amount === 0) return null;

            const existing = this._items.get(id);

            if (existing) {
                existing.product_amount += amt;
            } else {
                this._items.set(id, {id, price, description, title, product_amount: amount});
            }
            return true;
        }
    }
    window.korzina1 = new Korzina();
})