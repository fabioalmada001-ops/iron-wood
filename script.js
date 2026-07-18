const products = [
  {
    id: "IW-U-001",
    name: "Escritorio Urban L",
    category: "oficina",
    image: "assets/escritorio-l.jpg",
    description: "Escritorio envolvente con repisa para monitor y estantes laterales.",
    tags: ["A medida", "Home office", "Guardado"],
    details: ["Medidas personalizables", "Pasacables opcional", "Cajones opcionales", "Negro mate o grafito"]
  },
  {
    id: "IW-U-002",
    name: "Mesa Comedor Urban",
    category: "comedor",
    image: "assets/mesa-comedor.jpg",
    description: "Mesa de gran formato con estructura reforzada y tapa de madera.",
    tags: ["6 a 10 personas", "Robusta", "Personalizable"],
    details: ["Largo a elección", "Bancos o sillas opcionales", "Tapa de madera", "Uso interior o semicubierto"]
  },
  {
    id: "IW-L-001",
    name: "Rack TV Loft",
    category: "living",
    image: "assets/rack-tv.jpg",
    description: "Centro de entretenimiento liviano con estantes altos y composición modular.",
    tags: ["Modular", "Pasacables", "Living"],
    details: ["Ancho configurable", "Estantes laterales", "Espacio para equipos", "Módulos combinables"]
  },
  {
    id: "IW-E-001",
    name: "Biblioteca Executive",
    category: "living",
    image: "assets/biblioteca.jpg",
    description: "Biblioteca de gran presencia con estructura negra y fondo de madera.",
    tags: ["Premium", "Gran capacidad", "A medida"],
    details: ["Altura personalizable", "Fondo opcional", "Módulos dobles", "Fijación de seguridad"]
  },
  {
    id: "IW-L-002",
    name: "Mesa Ratona Frame",
    category: "living",
    image: "assets/mesa-ratona.jpg",
    description: "Mesa baja minimalista con tapa protagonista y bases metálicas tipo marco.",
    tags: ["Minimalista", "115 × 60 cm", "Living"],
    details: ["Altura de referencia 35 cm", "Tonos de madera", "Base tipo marco", "Medidas especiales"]
  },
  {
    id: "IW-D-001",
    name: "Mesa de Luz Duo",
    category: "dormitorio",
    image: "assets/mesa-luz.jpg",
    description: "Mesa auxiliar con dos cajones, estante abierto y estructura metálica.",
    tags: ["2 cajones", "Compacta", "Dormitorio"],
    details: ["Juego de dos opcional", "Correderas telescópicas", "Tiradores a elección", "Tonos personalizables"]
  },
  {
    id: "IW-C-001",
    name: "Biblioteca Modular Grid",
    category: "living",
    image: "assets/modular.jpg",
    description: "Sistema asimétrico de nichos, cajones y espacios abiertos.",
    tags: ["Configurable", "Guardado mixto", "Protagonista"],
    details: ["Nichos a medida", "Puertas y cajones", "Uso residencial o comercial", "Composición personalizada"]
  }
];

const productGrid = document.getElementById("productGrid");
const filters = [...document.querySelectorAll(".filter")];
const catalogSearch = document.getElementById("catalogSearch");
let activeFilter = "todos";

function renderProducts() {
  const term = catalogSearch.value.trim().toLowerCase();
  const visible = products.filter(product => {
    const filterMatch = activeFilter === "todos" || product.category === activeFilter;
    const searchMatch = `${product.name} ${product.description} ${product.tags.join(" ")}`
      .toLowerCase()
      .includes(term);
    return filterMatch && searchMatch;
  });

  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-body">
        <span class="product-code">${product.id}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="tags">${product.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
        <button class="text-link" data-product="${product.id}">Ver producto →</button>
      </div>
    </article>
  `).join("");

  if (!visible.length) {
    productGrid.innerHTML = `<p>No encontramos productos con ese filtro.</p>`;
  }
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProducts();
  });
});
catalogSearch.addEventListener("input", renderProducts);
renderProducts();

const productDialog = document.getElementById("productDialog");
const dialogClose = document.getElementById("dialogClose");
const useProduct = document.getElementById("useProduct");
let selectedProduct = null;

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-product]");
  if (!button) return;
  selectedProduct = products.find(product => product.id === button.dataset.product);
  document.getElementById("dialogImage").src = selectedProduct.image;
  document.getElementById("dialogImage").alt = selectedProduct.name;
  document.getElementById("dialogCode").textContent = selectedProduct.id;
  document.getElementById("dialogName").textContent = selectedProduct.name;
  document.getElementById("dialogDescription").textContent = selectedProduct.description;
  document.getElementById("dialogDetails").innerHTML =
    selectedProduct.details.map(detail => `<span>${detail}</span>`).join("");
  productDialog.showModal();
  document.body.classList.add("dialog-open");
});

function closeDialog() {
  productDialog.close();
  document.body.classList.remove("dialog-open");
}
dialogClose.addEventListener("click", closeDialog);
productDialog.addEventListener("click", event => {
  if (event.target === productDialog) closeDialog();
});
useProduct.addEventListener("click", () => {
  if (selectedProduct) {
    const select = document.getElementById("furnitureType");
    const mapping = {
      "IW-U-001": "escritorio",
      "IW-U-002": "mesa",
      "IW-L-001": "rack",
      "IW-E-001": "biblioteca",
      "IW-L-002": "mesa-ratona",
      "IW-D-001": "mesa-luz",
      "IW-C-001": "biblioteca"
    };
    select.value = mapping[selectedProduct.id] || "otro";
    document.getElementById("extraDetails").value =
      `Quiero tomar como referencia el modelo ${selectedProduct.name} (${selectedProduct.id}).`;
  }
  closeDialog();
  document.getElementById("personalizar").scrollIntoView({ behavior: "smooth" });
});

const designerForm = document.getElementById("designerForm");
const aiResult = document.getElementById("aiResult");
let proposalPlainText = "";

designerForm.addEventListener("submit", event => {
  event.preventDefault();

  const typeSelect = document.getElementById("furnitureType");
  const typeName = typeSelect.options[typeSelect.selectedIndex].text;
  const room = document.getElementById("roomType").value;
  const length = document.getElementById("length").value;
  const depth = document.getElementById("depth").value;
  const height = document.getElementById("height").value;
  const metal = document.getElementById("metalColor").value;
  const wood = document.getElementById("woodTone").value;
  const budget = document.getElementById("budget").value;
  const extra = document.getElementById("extraDetails").value.trim();
  const options = [...designerForm.querySelectorAll('input[type="checkbox"]:checked')]
    .map(item => item.value);

  const optionText = options.length ? options.join(", ") : "sin accesorios adicionales definidos";
  const profileSuggestion =
    length > 200 || height > 200
      ? "estructura reforzada, sujeta a revisión técnica"
      : "estructura de perfil estándar, sujeta a revisión técnica";

  const title = `${typeName} personalizado para ${room}`;
  const description =
    `Propuesta de ${typeName.toLowerCase()} de ${length} cm de largo, ${depth} cm de profundidad y ${height} cm de alto. ` +
    `Se plantea una estructura en ${metal.toLowerCase()} con madera tono ${wood.toLowerCase()}, ` +
    `${profileSuggestion}. La configuración incluye ${optionText}. ` +
    `${extra ? `Necesidad adicional: ${extra}. ` : ""}` +
    `Criterio de presupuesto: ${budget.toLowerCase()}.`;

  const specs = [
    `Medidas: ${length} × ${depth} × ${height} cm`,
    `Metal: ${metal}`,
    `Madera: ${wood}`,
    `Ambiente: ${room}`,
    `Accesorios: ${optionText}`,
    `Nivel buscado: ${budget}`
  ];

  document.getElementById("proposalTitle").textContent = title;
  document.getElementById("proposalText").textContent = description;
  document.getElementById("proposalSpecs").innerHTML =
    specs.map(spec => `<span>${spec}</span>`).join("");

  proposalPlainText =
    `IRON WOOD - PROPUESTA PRELIMINAR\n\n${title}\n${description}\n\n${specs.join("\n")}`;
  const whatsappNumber = "5490000000000";
  document.getElementById("whatsappProposal").href =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(proposalPlainText)}`;

  aiResult.hidden = false;
  aiResult.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("copyProposal").addEventListener("click", async event => {
  try {
    await navigator.clipboard.writeText(proposalPlainText);
    event.target.textContent = "Propuesta copiada";
    setTimeout(() => event.target.textContent = "Copiar propuesta", 1800);
  } catch {
    alert("No se pudo copiar automáticamente. Seleccioná el texto de la propuesta.");
  }
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
