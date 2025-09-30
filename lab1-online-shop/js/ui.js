document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-product-buy]');
    if (!btn) return;

    const card = btn.closest('.product-card');
    if (!card) return;

    const image = card.querySelector('img');
    const price = card.querySelector('[data-product-price]');
    const title = card.querySelector('[data-product-title]');
    const description = card.querySelector('[data-product-desc]');

    const productId = card.getAttribute('data-product-id') || image?.getAttribute('alt')?.trim();
    const productTitle = (title?.innerText || '').trim();
    const productPrice = Number(price?.innerText);
    const productDescription = (description?.innerText || '').trim();

    const ok = korzina1.add({ productId, productPrice, productTitle, productDescription });

    if (ok) {
        korzina1.save();
        renderMiniKorz();
        renderKorzina();
    } else {
        alert('Не удалось добавить продукт :( !');
    }
});