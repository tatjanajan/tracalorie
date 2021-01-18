// Storage Controler
const StorageCtrl = (function() {
    // Public methods
    return {
        storeItem: function(item) {
            let items;
            // Check if any items i ls
            if(localStorage.getItem('items') === null) {
                items = [];
                // Push new item
                items.push(item);
                // Set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // Get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));

                // Push new item
                items.push(item);

                // Reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem)
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(id === item.id) {
                    items.splice(index, 1)
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    } 
})();

// Item Controler
const ItemCtrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    
    // Data Structure / State
    const data = { // privatno, ne može se pristupiti izvana
        // items: [
        //     // {id: 0, name: 'Stake Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 900}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return { // ono što vratimo je public, može mu se pristupiti izvana
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            // Create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
           calories = parseInt(calories);

           // Create new item
           newItem = new Item(ID, name, calories);

           // Add to items array
           data.items.push(newItem);

           return newItem;
        },
        getItemById: function(id) {
            let found = null;
            //Loop through items
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item;
                }
            })
            return found;
        },
        updateItem: function(name, calories) {
            let found = null;
            // Calories to number
            calories = parseInt(calories);
            
            data.items.forEach((item) => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            // Get ids
            ids = data.items.map(function(item) {
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalClaories: function() {
            // Loop through items and get cals using reduce arr method
            const total = data.items.reduce((acc, item) => {
                return acc + item.calories;    
            }, 0)

            // Set total cal in data structure
            data.totalCalories = total;

            //Return total
            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }

})();

// UI Controler
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: ".total-calories"
    }

    // Public methods
    return {
        populateItemsList: function(items)  {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil-alt"></i>
                            </a>
                        </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;

            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil-alt"></i>
            </a>`
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML =`<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil-alt"></i>
                    </a>`;
                }
            })
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems.forEach(function(item) {
                item.remove();
            })
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline-block';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline-block';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline-block';
            document.querySelector(UISelectors.backBtn).style.display = 'inline-block';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }
    }

})();

// App Controler
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function() {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e) {
            if(e.keycode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
        

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', itemBackSubmit);
        
        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // Get for input from UI Controler
        const input = UICtrl.getItemInput();

        // Check for name and calories input
        if(input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalClaories();            
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in localStorage
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
            // Get the list item id (item-0, item-1,..)
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArr = listId.split('-');
            
            // Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault()    
    }; 
    
    // Update item submit
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UICtrl.getItemInput();
        
        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        
        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalClaories();      
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    // Delete button submit
    const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalClaories();      
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear all items event
    const clearAllItemsClick = function() {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalClaories();      
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Remove from UI
        UICtrl.removeItems();

        // Clear from local storage
        StorageCtrl.clearItemsFromStorage();

        // Hide ul
        UICtrl.hideList();
    }

    // Item back submit
    const itemBackSubmit = function(e) {
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Public methods
    return {
        init: function() { // ono što će biti kad se aplikacija loada
            // Clear edit state / set initial state
            UICtrl.clearEditState();
            
            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemsList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalClaories();            
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        },
    }

})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize App
App.init();