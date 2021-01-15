// Storage Controler

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
        items: [
            // {id: 0, name: 'Stake Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 900}
        ],
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
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
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
const App = (function(ItemCtrl, UICtrl){
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
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)
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

})(ItemCtrl, UICtrl);

//Initialize App
App.init();