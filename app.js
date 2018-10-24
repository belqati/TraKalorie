// Storage Controller

// Item Controller--IIFE function
const ItemCtrl = (function(){
  // item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // data structure / State
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 900},
      // {id: 1, name: 'Cookie', calories: 100},
      // {id: 2, name: 'Eggs', calories: 150}
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    // return items only
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      // create id
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id +1;
      } else {
        ID = 0;
      }

      // calories to number
      calories = parseInt(calories);

      // create new Item
      newItem = new Item(ID, name, calories);

      // add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null;
      // loop through items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    // loop through items and add total calories
    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      });

      // set total calories in data structure
      data.totalCalories = total;
      // return total calories
      return data.totalCalories;
    },
    // return all data
    logData: function(){
      return data;
    }
  }
})();


// UI Controller--IIFE function
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn', 
    updateBtn: '.update-btn', 
    deleteBtn: '.delete-btn', 
    backBtn: '.back-btn', 
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  // Public methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `
          <li id="item-${item.id}" class="collection-item">
            <strong>${item.name}</strong>
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fas fa-pencil-alt"></i>
            </a>
          </li>
        `;
      });

      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // show list
      document.querySelector(UISelectors.itemList).style.display = 'block';

      // create li element
      const li = document.createElement('li');

      // add class, id, and html
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}</strong>
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
      `;

      // insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    showEditState: function(){
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();

// App Controller--init whatever we want the app to immediately load
const App = (function(ItemCtrl, UICtrl){
  // load event listeners
  const loadEventListeners = function(){
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
  }

  // add item submit
  const itemAddSubmit = function(e){
    // get form input from UICtrl
    const input = UICtrl.getItemInput();

    // check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // add item to UI list
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // update item submit
  const itemUpdateSubmit = function(e){
    if(e.target.classList.contains('edit-item')){
      // get list item id (item-0, item-1, etc.)
      const listId = e.target.parentNode.parentNode.id;
      // break list item into an array
      const listIdArr = listId.split('-');
      // select only the id number from array
      const id = parseInt(listIdArr[1]);
      // get whole item
      const itemToEdit = ItemCtrl.getItemById(id);
      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // add item to UI form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Public methods
  return {
    init: function(){
      console.log('Initializing TraKalorie!');
      // set initial state
      UICtrl.clearEditState();

      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // check if items exist
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        // populate list from items
        UICtrl.populateItemList(items);
      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

// Init App
App.init();
