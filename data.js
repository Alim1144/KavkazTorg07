// Система управления товарами
class ProductManager {
    constructor() {
        this.storageKey = 'kavkaztorg_products';
        this.checkLocalStorage();
        this.init();
    }

    checkLocalStorage() {
        // Проверяем доступность localStorage
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
        } catch (e) {
            console.error('localStorage недоступен:', e);
            alert('Внимание: localStorage недоступен в вашем браузере. Данные не будут сохраняться. Пожалуйста, включите cookies и localStorage в настройках браузера.');
        }
    }

    init() {
        // Инициализация начальных данных, если их нет
        const existingData = this.getProducts();
        
        if (!existingData || !existingData.pallets || !existingData.drinks) {
            // Данных нет или структура неправильная - создаем начальные данные
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
                        description: 'Стандартный европейский поддон высокого качества',
                        image: ''
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
            
            // Сохраняем только если данных действительно нет
            if (!existingData) {
                this.saveProducts(initialProducts);
            } else {
                // Если структура неправильная, исправляем её
                if (!existingData.pallets) {
                    existingData.pallets = initialProducts.pallets;
                }
                if (!existingData.drinks) {
                    existingData.drinks = initialProducts.drinks;
                }
                this.saveProducts(existingData);
            }
        }
        // Если данные есть и структура правильная - ничего не делаем, не перезаписываем!
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
