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

        static _toAmt(amt){
            if (amt == null) return null;
            const s = Number(amt);
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

        remove(id){
            const key = Korzina._toId(id);
            if (key === null) return null;
            this._items.delete(id);
        }

        setAmount(id, amount){
            const key = Korzina._toId(id);
            const amt = Korzina._toAmt(amount);
            if (!key || !amt) return null;

            if (key === 0) {
                this._items.delete(key);
                return true
            }

            const pr = this._items.get(key);
            if (!pr) return false;
            pr.product_amount = amt;
        }

        list(){
            return Array.from(this._items.values()).map(i => ({...i}));
        }

        count(){
            let counter = 0;
            for (const i in this._items.values) counter += i.product_amount;
            return counter;
        }

        total(){
            let total = 0;
            for (const i in this._items.values()) total += i.product_amount * i.price;
            return total;
        }

        clear(){
            this._items.clear();
        }

        save(){
            const data = this.list();
            try{
                localStorage.setItem(this._storageKey, JSON.stringify(data));
                return true;
            } catch(err){
                console.log(err);
                return false;
            }
        }

        load(){
            const raw = localStorage.getItem(this._storageKey);
            if (raw == null) return false;

            const arr = JSON.parse(raw);
            if (!Array.isArray(arr)) return false;

            this._items.clear();
            for (const row in arr){
                this.add(
                    { id: row.id, title: row.title, price: row.price, description: row.description },
                    row.product_amount
                );
            }
            return true;
        } catch (e) {
            console.warn('Failed:', e);
            return false;}

    }
    window.korzina1 = new Korzina();
})