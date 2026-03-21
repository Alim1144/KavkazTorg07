const DEFAULT_PRODUCTS = {
    pallets: [
        {
            id: 101,
            name: 'Европаллет',
            size: '1200x800 мм',
            price: 500,
            priceNote: 'с учетом НДС',
            badge: 'Популярное',
            icon: '📦',
            description: 'Европейский деревянный поддон стандартного размера',
            image: 'images/products/euro-pallet.png',
            section: 'pallet'
        }
    ],
    drinks: [
        {
            id: 201,
            name: 'Вишневый лимонад',
            size: '1,5 л',
            price: 40,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный напиток со вкусом вишни',
            image: 'images/products/cherry-lemonade.png',
            section: 'drink-15'
        },
        {
            id: 202,
            name: 'Минеральная вода',
            size: '0,5 л',
            price: 40,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Минеральная газированная вода в стеклянной бутылке',
            image: 'images/products/mineral-water.png',
            section: 'drink-water'
        },
        {
            id: 203,
            name: 'Апельсиновый лимонад',
            size: '1,5 л',
            price: 40,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный напиток со вкусом апельсина',
            image: 'images/products/orange-lemonade.png',
            section: 'drink-15'
        },
        {
            id: 204,
            name: 'Яблочный лимонад',
            size: '1,5 л',
            price: 40,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный напиток со вкусом яблока',
            image: 'images/products/apple-lemonade.png',
            section: 'drink-15'
        },
        {
            id: 205,
            name: 'Тархун стекло',
            size: '0,5 л',
            price: 50,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный напиток Тархун в стеклянной бутылке',
            image: 'images/products/tarhun-glass.png',
            section: 'drink-glass'
        },
        {
            id: 206,
            name: 'Тархун 1,5 л',
            size: '1,5 л',
            price: 40,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный напиток Тархун в ПЭТ-бутылке 1,5 л',
            image: 'images/products/tarhun-15l.png',
            section: 'drink-15'
        },
        {
            id: 207,
            name: 'Мохито 1,5 л',
            size: '1,5 л',
            price: 40,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Освежающий газированный напиток Мохито 1,5 л',
            image: 'images/products/mojito-15l.png',
            section: 'drink-15'
        },
        {
            id: 208,
            name: 'Груша стекло',
            size: '0,5 л',
            price: 50,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный грушевый напиток в стеклянной бутылке',
            image: 'images/products/pear-glass.png',
            section: 'drink-glass'
        },
        {
            id: 209,
            name: 'Кола 1,5 л',
            size: '1,5 л',
            price: 40,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный напиток Кола в ПЭТ-бутылке 1,5 л',
            image: 'images/products/cola-15l.png',
            section: 'drink-15'
        },
        {
            id: 210,
            name: 'Апельсиновый стекло',
            size: '0,5 л',
            price: 50,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный апельсиновый напиток в стеклянной бутылке',
            image: 'images/products/orange-glass.png',
            section: 'drink-glass'
        },
        {
            id: 211,
            name: 'Грушевый 1,5 л',
            size: '1,5 л',
            price: 40,
            priceNote: 'с учетом НДС',
            badge: '',
            icon: '🥤',
            description: 'Газированный грушевый напиток в ПЭТ-бутылке 1,5 л',
            image: 'images/products/pear-15l.png',
            section: 'drink-15'
        }
    ]
};

// Система управления товарами
class ProductManager {
    constructor() {
        this.storageKey = 'kavkaztorg_products';
        this.checkLocalStorage();
        this.init();
    }

    checkLocalStorage() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
        } catch (e) {
            console.error('localStorage недоступен:', e);
            alert('Внимание: localStorage недоступен в вашем браузере. Данные не будут сохраняться.');
        }
    }

    cloneDefaults() {
        return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    }

    init() {
        const existingData = this.getProducts();
        if (!existingData) {
            this.saveProducts(this.cloneDefaults());
            return;
        }

        if (!existingData.pallets) existingData.pallets = [];
        if (!existingData.drinks) existingData.drinks = [];

        let changed = false;

        ['pallets', 'drinks'].forEach((category) => {
            const defaultMap = new Map(DEFAULT_PRODUCTS[category].map((item) => [item.id, item]));
            const existingMap = new Map(existingData[category].map((item) => [item.id, item]));

            DEFAULT_PRODUCTS[category].forEach((item) => {
                if (!existingMap.has(item.id)) {
                    existingData[category].push({ ...item });
                    changed = true;
                    return;
                }

                const current = existingMap.get(item.id);
                if (current.price !== item.price || current.image !== item.image || current.section !== item.section || current.size !== item.size) {
                    Object.assign(current, {
                        price: item.price,
                        image: item.image,
                        section: item.section,
                        size: item.size
                    });
                    changed = true;
                }
            });

            // Удаляем записи с дублирующимися id, сохраняя первую
            const seen = new Set();
            existingData[category] = existingData[category].filter((item) => {
                if (seen.has(item.id)) {
                    changed = true;
                    return false;
                }
                seen.add(item.id);
                return true;
            });
        });

        if (changed) {
            this.saveProducts(existingData);
        }
    }

    getProducts() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Ошибка при чтении данных:', error);
        }
        return null;
    }

    saveProducts(products) {
        try {
            // Валидация данных перед сохранением
            if (!products || typeof products !== 'object') {
                console.error('Некорректные данные для сохранения');
                return false;
            }

            // Убеждаемся, что структура правильная
            if (!products.pallets) products.pallets = [];
            if (!products.drinks) products.drinks = [];

            const jsonData = JSON.stringify(products);
            
            // Проверяем размер данных (localStorage обычно ограничен ~5-10 МБ)
            if (jsonData.length > 4 * 1024 * 1024) { // 4 МБ
                console.warn('Данные очень большие, возможны проблемы с сохранением');
            }
            
            localStorage.setItem(this.storageKey, jsonData);
            
            // Проверяем, что данные действительно сохранились
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) {
                console.error('Данные не сохранились в localStorage (null)');
                return false;
            }
            
            // Сравниваем сохраненные данные (можем сравнивать по длине и первым символам)
            if (saved.length !== jsonData.length) {
                console.error('Данные сохранились некорректно (разная длина)');
                return false;
            }
            
            // Триггер события для обновления страницы
            window.dispatchEvent(new CustomEvent('productsUpdated'));
            
            console.log('Данные успешно сохранены:', {
                pallets: products.pallets.length,
                drinks: products.drinks.length,
                size: (jsonData.length / 1024).toFixed(2) + ' КБ'
            });
            
            return true;
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            // Если localStorage переполнен, пытаемся очистить старые данные
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                alert('Недостаточно места в хранилище браузера. Пожалуйста, удалите некоторые товары с большими изображениями или очистите кеш браузера.');
            } else if (error.name === 'SecurityError' || error.code === 18) {
                alert('Доступ к localStorage запрещен. Проверьте настройки браузера.');
            }
            return false;
        }
    }

    addProduct(category, product) {
        const products = this.getProducts();
        if (!products) {
            // Если данных нет, инициализируем структуру
            const newProducts = {
                pallets: [],
                drinks: []
            };
            newProducts[category] = [product];
            product.id = Date.now();
            if (this.saveProducts(newProducts)) {
                return product;
            }
            return null;
        }
        
        if (!products[category]) {
            products[category] = [];
        }
        product.id = Date.now(); // Простой ID на основе времени
        products[category].push(product);
        if (this.saveProducts(products)) {
            return product;
        }
        return null;
    }

    updateProduct(category, productId, updatedProduct) {
        const products = this.getProducts();
        if (!products) {
            console.error('Нет данных для обновления');
            return false;
        }
        
        if (products[category]) {
            const index = products[category].findIndex(p => p.id === productId);
            if (index !== -1) {
                // Сохраняем ID и обновляем остальные поля
                products[category][index] = { 
                    ...products[category][index], 
                    ...updatedProduct,
                    id: productId // Явно сохраняем ID
                };
                if (this.saveProducts(products)) {
                    return true;
                }
            }
        }
        return false;
    }

    deleteProduct(category, productId) {
        const products = this.getProducts();
        if (!products) {
            console.error('Нет данных для удаления');
            return false;
        }
        
        if (products[category]) {
            products[category] = products[category].filter(p => p.id !== productId);
            if (this.saveProducts(products)) {
                return true;
            }
        }
        return false;
    }
}

// Глобальный экземпляр менеджера
const productManager = new ProductManager();
