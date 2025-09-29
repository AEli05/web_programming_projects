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

            if (!id || !title || !description || !Number.isFinite(price) || amount == null || amount <= 0) return null;

            const existing = this._items.get(id);
            if (existing) {
                existing.product_amount += amount;
            } else {
                this._items.set(id, { id, price, description, title, product_amount: amount });
            }
            return true;
        }

        remove(id){
            const key = Korzina._toId(id);
            if (key == null) return null;
            this._items.delete(key);
            return true;
        }

        setAmount(id, amount){
            const key = Korzina._toId(id);
            const amt = Korzina._toAmt(amount);
            if (!key || amt == null || amt < 0) return null;

            if (amt === 0) {
                this._items.delete(key);
                return true;
            }
            const pr = this._items.get(key);
            if (!pr) return false;
            pr.product_amount = amt;
            return true;

        }

        list(){
            return Array.from(this._items.values()).map(i => ({...i}));
        }

        count(){
            let counter = 0;
            for (const i of this._items.values()) counter += i.product_amount;
            return counter;
        }

        total(){
            let total = 0;
            for (const i of this._items.values()) total += i.product_amount * i.price;
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
            try {
                const raw = localStorage.getItem(this._storageKey);
                if (raw == null) return false;
                const arr = JSON.parse(raw);
                if (!Array.isArray(arr)) return false;

                this._items.clear();
                for (const row of arr){
                    this.add(
                        { productId: row.id, productTitle: row.title, productPrice: row.price, productDescription: row.description },
                        row.product_amount
                    );
                }
                return true;
            } catch (e) {
                console.warn('Failed:', e);
                return false;
            }
        }

    }
    window.korzina1 = new Korzina();

    korzina1.load();
    renderMiniKorz();
    renderKorzina();

}) ();

function renderMiniKorz(){
    const badge = document.querySelector('[data-corsina-obj-count]');
    if (badge) badge.textContent = String(korzina1.count());
}

renderMiniKorz();

function renderKorzina(){
    const listEl = document.querySelector('[data-corsina-list]');
    const totalEl = document.querySelector('[data-corsina-output]');
    if (!listEl || !totalEl) return;

    const items = korzina1.list();
    if (items.length === 0){
        listEl.innerHTML = '<p style="margin:0">Пусто</p>';
    } else {
        listEl.innerHTML = items.map(row => {
            const subtotal = row.price * row.product_amount;
            return `
        <div class="korz-row" data-id="${row.id}">
          <div class="korz-title">${row.title}</div>
          <div class="korz-price">${row.price}₽</div>
          <div class="korz-qty">
            <button type="button" class="korz-btn korz-minus" aria-label="Уменьшить">−</button>
            <input class="korz-input" type="number" min="0" step="1" value="${row.product_amount}" inputmode="numeric">
            <button type="button" class="korz-btn korz-plus" aria-label="Увеличить">+</button>
          </div>
          <div class="korz-sub">${subtotal}₽</div>
          <button type="button" class="korz-del" aria-label="Удалить">×</button>
        </div>
      `;
        }).join('');
    }

    totalEl.textContent = String(korzina1.total());
    renderMiniKorz();
}

document.addEventListener('click', (e) => {
    const row = e.target.closest('.korz-row');
    if (!row) return;
    const id = row.getAttribute('data-id');

    if (e.target.closest('.korz-plus')){
        const current = korzina1.list().find(i => i.id === id)?.product_amount ?? 0;
        korzina1.setAmount(id, current + 1);
        korzina1.save();
        renderKorzina();
    }

    if (e.target.closest('.korz-minus')){
        const current = korzina1.list().find(i => i.id === id)?.product_amount ?? 0;
        korzina1.setAmount(id, Math.max(0, current - 1));
        korzina1.save();
        renderKorzina();
    }

    if (e.target.closest('.korz-del')){
        korzina1.remove(id);
        korzina1.save();
        renderKorzina();
    }
});


document.addEventListener('input', (e) => {
    const input = e.target.closest('.korz-input');
    if (!input) return;
    const row = e.target.closest('.korz-row');
    if (!row) return;
    const id = row.getAttribute('data-id');

    const val = Number(input.value);
    if (Number.isFinite(val) && val >= 0){
        korzina1.setAmount(id, val);
        korzina1.save();
        renderKorzina();
    }
});

