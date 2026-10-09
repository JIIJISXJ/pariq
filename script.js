"use strict";

// إعدادات المتجر
const WHATSAPP_NUMBER = "201201241122";
const SHIPPING_COST = 70;

// المنتجات والأسعار التجريبية
const products = [
  {
    id: 1,
    name: "سلسلة أنيقة",
    category: "accessories",
    categoryName: "إكسسوارات",
    price: 180,
    description: "لمسة بسيطة تكمل إطلالتك.",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
    tag: "مميز"
  },
  {
    id: 2,
    name: "سوار أنيق",
    category: "accessories",
    categoryName: "إكسسوارات",
    price: 120,
    description: "اختيار لطيف للاستخدام اليومي.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=700&q=80",
    tag: "جديد"
  },
  {
    id: 3,
    name: "هدية بتغليف أنيق",
    category: "gifts",
    categoryName: "هدايا",
    price: 250,
    description: "فكرة هدية لمناسباتك المميزة.",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&q=80",
    tag: "هدية"
  },
  {
    id: 4,
    name: "بوكس هدايا",
    category: "gifts",
    categoryName: "هدايا",
    price: 320,
    description: "اختيار مميز لإسعاد شخص بتحبه.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80",
    tag: "مميز"
  },
  {
    id: 5,
    name: "مجموعة فرش تجميل",
    category: "beauty",
    categoryName: "تجميل",
    price: 220,
    description: "مجموعة فرش للاستخدام اليومي.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
    tag: "الأكثر طلباً"
  },
  {
    id: 6,
    name: "منظم أدوات التجميل",
    category: "beauty",
    categoryName: "تجميل",
    price: 190,
    description: "رتب أدواتك وخليها في مكان واحد.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80",
    tag: "عملي"
  },
  {
    id: 7,
    name: "مجموعة عناية بالبشرة",
    category: "skincare",
    categoryName: "العناية بالبشرة",
    price: 280,
    description: "مجموعة منتجات للعناية اليومية.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
    tag: "مميز"
  },
  {
    id: 8,
    name: "عبوة عناية بالبشرة",
    category: "skincare",
    categoryName: "العناية بالبشرة",
    price: 160,
    description: "منتج عناية ضمن روتينك اليومي.",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80",
    tag: "جديد"
  }
];

// عناصر الموقع
const productsGrid = document.getElementById("productsGrid");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const overlay = document.getElementById("overlay");
const checkoutBtn = document.getElementById("checkoutBtn");
const searchInput = document.getElementById("searchInput");
const searchBox = document.getElementById("searchBox");

let cart = [];
let selectedCategory = "all";

// تنسيق الأسعار
function formatPrice(number) {
  return new Intl.NumberFormat("ar-EG").format(number);
}

// عرض المنتجات
function renderProducts() {
  if (!productsGrid) return;

  const query = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    const searchableText = (
      product.name + " " +
      product.categoryName + " " +
      product.description
    ).toLowerCase();

    const matchesSearch = searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  productsGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-products">
        مفيش منتجات مطابقة للبحث حالياً 🔎
      </div>
    `;
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <div class="product-category">
          ${product.categoryName}
        </div>

        <h3 class="product-name">${product.name}</h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">
          <span class="product-price">
            ${formatPrice(product.price)} جنيه
          </span>

          <button
            class="add-btn"
            data-add="${product.id}"
            aria-label="أضف ${product.name} للسلة"
            title="أضف للسلة"
          >+</button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

// فتح السلة
function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("no-scroll");
  cartPanel.setAttribute("aria-hidden", "false");
}

// إغلاق السلة
function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("no-scroll");
  cartPanel.setAttribute("aria-hidden", "true");
}

// إضافة منتج للسلة
function addToCart(productId) {
  const product = products.find(
    item => item.id === Number(productId)
  );

  if (!product) return;

  const existing = cart.find(
    item => item.id === product.id
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...product,
      qty: 1
    });
  }

  renderCart();
  openCart();
}

// تعديل الكمية
function changeQuantity(productId, change) {
  const item = cart.find(
    product => product.id === Number(productId)
  );

  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(
      product => product.id !== Number(productId)
    );
  }

  renderCart();
}

// حذف منتج
function removeFromCart(productId) {
  cart = cart.filter(
    item => item.id !== Number(productId)
  );

  renderCart();
}

// حساب مجموع المنتجات
function calculateSubtotal() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
}

// حساب الشحن
function calculateShipping(subtotal) {
  return subtotal > 0 ? SHIPPING_COST : 0;
}

// عرض السلة والإجمالي
function renderCart() {
  const quantity = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  cartCount.textContent = formatPrice(quantity);

  document.getElementById("subtotal").textContent =
    formatPrice(subtotal) + " جنيه";

  document.getElementById("shipping").textContent =
    formatPrice(shipping) + " جنيه";

  document.getElementById("total").textContent =
    formatPrice(total) + " جنيه";

  checkoutBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <h3>سلتك لسه فاضية!</h3>
        <p>اختار المنتجات اللي عجبتك وابدأ التسوق.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach(item => {
    const element = document.createElement("div");
    element.className = "cart-item";

    element.innerHTML = `
      <img src="${item.image}" alt="${item.name}">

      <div>
        <div class="cart-item-name">${item.name}</div>

        <div class="cart-item-price">
          ${formatPrice(item.price * item.qty)} جنيه
        </div>

        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button
              data-quantity="-1"
              data-id="${item.id}"
              aria-label="تقليل الكمية"
            >−</button>

            <span>${formatPrice(item.qty)}</span>

            <button
              data-quantity="1"
              data-id="${item.id}"
              aria-label="زيادة الكمية"
            >+</button>
          </div>

          <button
            class="remove-item"
            data-remove="${item.id}"
          >حذف</button>
        </div>
      </div>
    `;

    cartItems.appendChild(element);
  });
}

// الضغط على أزرار الموقع
document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");

  if (addButton) {
    addToCart(addButton.dataset.add);
    return;
  }

  const quantityButton = event.target.closest("[data-quantity]");

  if (quantityButton) {
    changeQuantity(
      quantityButton.dataset.id,
      Number(quantityButton.dataset.quantity)
    );
    return;
  }

  const removeButton = event.target.closest("[data-remove]");

  if (removeButton) {
    removeFromCart(removeButton.dataset.remove);
  }
});

// فتح وإغلاق السلة
document.getElementById("cartToggle").addEventListener(
  "click",
  openCart
);

document.getElementById("closeCart").addEventListener(
  "click",
  closeCart
);

overlay.addEventListener("click", closeCart);

// البحث عن المنتجات
document.getElementById("searchToggle").addEventListener(
  "click",
  () => {
    searchBox.classList.toggle("show");

    if (searchBox.classList.contains("show")) {
      searchInput.focus();
    } else {
      searchInput.value = "";
      renderProducts();
    }
  }
);

searchInput.addEventListener("input", renderProducts);

// اختيار الأقسام
document.querySelectorAll("[data-category]").forEach(card => {
  card.addEventListener("click", function () {
    selectedCategory = this.dataset.category;

    renderProducts();
  });
});

// إرسال الطلب إلى واتساب
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("سلتك لسه فاضية! اختار المنتجات الأول 🛍️");
    return;
  }

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  let message = "🔥 أهلاً PARIQ STORE! 🔥\n";
  message += "عايز أأكد الأوردر بتاعي 🛍️💗\n\n";
  message += "📦 تفاصيل الطلب:\n";
  message += "━━━━━━━━━━━━━━━━━━\n\n";

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `الكمية: ${item.qty}\n`;
    message += `سعر القطعة: ${formatPrice(item.price)} جنيه\n`;
    message += `الإجمالي: ${formatPrice(item.price * item.qty)} جنيه\n\n`;
  });

  message += "━━━━━━━━━━━━━━━━━━\n";
  message += `مجموع المنتجات: ${formatPrice(subtotal)} جنيه\n`;
  message += `الشحن: ${formatPrice(shipping)} جنيه\n`;
  message += `الإجمالي النهائي: ${formatPrice(total)} جنيه\n`;
  message += "━━━━━━━━━━━━━━━━━━\n\n";
  message += "ياريت تأكدولي توافر المنتجات وتفاصيل التوصيل ❤️";

  const whatsappURL =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
}

checkoutBtn.addEventListener("click", checkoutWhatsApp);

// إغلاق السلة بزر Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
  }
});

// السنة الحالية في التذييل
document.getElementById("currentYear").textContent =
  new Date().getFullYear();

// تشغيل الموقع عند تحميل الملف
renderProducts();
renderCart();
