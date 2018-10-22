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
    // return all data
    logData: function(){
      return data;
    }
  }
})();


// UI Controller--IIFE function
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list'
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
    }
  }
})();

// App Controller--init whatever we want the app to immediately load
const App = (function(ItemCtrl, UICtrl){
  // Public methods
  return {
    init: function(){
      console.log('Initializing TraKalorie!');
      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // populate list from items
      UICtrl.populateItemList(items);
    }
  }
})(ItemCtrl, UICtrl);

// Init App
App.init();
