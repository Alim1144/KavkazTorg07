// Система управления товарами
class ProductManager {
    constructor() {
        this.storageKey = 'kavkaztorg_products';
        this.init();
    }

    init() {
        // Инициализация начальных данных, если их нет
        if (!this.getProducts()) {
            const initialProducts = {
                pallets: [
                    {
                        id: 1,
                        name: 'Европаллет (европейский)',
                        size: '1200×800 мм',
                        price: 500,
                        priceNote: 'с учетом НДС',
                        badge: 'Популярное',
                        icon: '📦',
                        description: 'Стандартный европейский поддон высокого качества'
                    }
                ],
                drinks: [
                    {
                        id: 1,
                        name: 'Coca-Cola',
                        size: '0.5 л',
                        price: 80,
                        priceNote: 'за бутылку',
                        badge: 'Популярное',
                        icon: '🥤',
                        description: 'Классический газированный напиток',
                        image: ''
                    },
                    {
                        id: 2,
                        name: 'Sprite',
                        size: '0.5 л',
                        price: 75,
                        priceNote: 'за бутылку',
                        badge: 'Популярное',
                        icon: '🥤',
                        description: 'Освежающий лимонно-лаймовый напиток',
                        image: ''
                    },
                    {
                        id: 3,
                        name: 'Fanta',
                        size: '0.5 л',
                        price: 75,
                        priceNote: 'за бутылку',
                        badge: 'Новинка',
                        icon: '🥤',
                        description: 'Апельсиновый газированный напиток',
                        image: ''
                    }
                ]
            };
            this.saveProducts(initialProducts);
        }
    }

    getProducts() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    saveProducts(products) {
        localStorage.setItem(this.storageKey, JSON.stringify(products));
        // Триггер события для обновления страницы
        window.dispatchEvent(new CustomEvent('productsUpdated'));
    }

    addProduct(category, product) {
        const products = this.getProducts();
        if (!products[category]) {
            products[category] = [];
        }
        product.id = Date.now(); // Простой ID на основе времени
        products[category].push(product);
        this.saveProducts(products);
        return product;
    }

    updateProduct(category, productId, updatedProduct) {
        const products = this.getProducts();
        if (products[category]) {
            const index = products[category].findIndex(p => p.id === productId);
            if (index !== -1) {
                products[category][index] = { ...products[category][index], ...updatedProduct };
                this.saveProducts(products);
                return true;
            }
        }
        return false;
    }

    deleteProduct(category, productId) {
        const products = this.getProducts();
        if (products[category]) {
            products[category] = products[category].filter(p => p.id !== productId);
            this.saveProducts(products);
            return true;
        }
        return false;
    }
}

// Глобальный экземпляр менеджера
const productManager = new ProductManager();
