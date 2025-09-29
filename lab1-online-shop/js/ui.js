document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-product-buy]')
    if (!btn) return null;

    const card = btn.closest('.product-card')
    if (!card) return null;

    const image = card.querySelector('img');
    const price = card.querySelector('[data-product-price]')
    const title = card.querySelector('[data-product-title]')

    const productId = card.querySelector(image?.getAttribute('alt')).trim();
    const productTitle = (title?.innerText).trim();
    const productPrice = Number(price?.innerText).trim();

    

})