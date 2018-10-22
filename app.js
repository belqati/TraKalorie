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
      {id: 2, name: 'Eggs', calories: 150},
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    // return data for browser accessibility
    logData: function(){
      return data;
    }
  }
})();


// UI Controller--IIFE function
const UICtrl = (function(){
  // Public methods
  return {

  }
})();

// App Controller--init whatever we want the app to immediately load
const App = (function(ItemCtrl, UICtrl){
  // Public methods
  return {
    init: function(){
      console.log('init!')
    }
  }
})(ItemCtrl, UICtrl);

// Init App
App.init();
