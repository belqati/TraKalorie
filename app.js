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
      {id: 0, name: 'Steak Dinner', calories: 900},
      {id: 1, name: 'Cookie', calories: 100},
      {id: 2, name: 'Eggs', calories: 150}
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
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories'
  }

  // Public methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `
          <li id="item-${item.id}" class="collection-item">
            <strong>${item.name}</strong>
            <em>${item.calories}</em>
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
  }

  // add item submit
  const itemAddSubmit = function(e){
    // get form input from UICtrl
    const input = UICtrl.getItemInput();

    // check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
    }

    e.preventDefault();
  }

  // Public methods
  return {
    init: function(){
      console.log('Initializing TraKalorie!');
      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // populate list from items
      UICtrl.populateItemList(items);

      // load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

// Init App
App.init();
