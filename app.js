// Storage Controller
const StorageCtrl = (function(){
  // Public Methods
  return {
    storeItem: function(item){
      let items;
      // check if items in LS
      if(localStorage.getItem('items') === null){
        items = [];
        // push new item
        items.push(item);
        // set to LS
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        // push new item to LS
        items.push(item);
        // reset LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();

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
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 900},
    //   // {id: 1, name: 'Cookie', calories: 100},
    //   // {id: 2, name: 'Eggs', calories: 150}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
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
    updateItem: function(name, calories){
      // calories to number
      calories = parseInt(calories);
      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id){
      // get ids
      const ids = data.items.map(function(item){
        return item.id;
      });

      // get index of ids
      const index = ids.indexOf(id);

      // remove item via id
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
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
    listItems: '#item-list li',
    addBtn: '.add-btn', 
    updateBtn: '.update-btn', 
    deleteBtn: '.delete-btn', 
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
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
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // convert node-list to array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}</strong>
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fas fa-pencil-alt"></i>
            </a>
          `;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
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
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // convert node-list to array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
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
      UICtrl.clearBtnShow();
    },
    showEditState: function(){
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      UICtrl.clearBtnHide();
    },
    clearBtnHide: function(){
      document.querySelector(UISelectors.clearBtn).style.display = 'none';
    },
    clearBtnShow: function(){
      if(localStorage.getItem('items') !== null){
        console.log('there is a list!');
        document.querySelector(UISelectors.clearBtn).style.display = 'inline';
      } else {
        console.log('no list!');
        UICtrl.clearBtnHide();
      }
      // document.querySelector(UISelectors.clearBtn).style.display = 'inline';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();

// App Controller--init whatever we want the app to immediately load
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  // load event listeners
  const loadEventListeners = function(){
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // update edited item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // clear all items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

      // localstorage
      StorageCtrl.storeItem(newItem);

      // show clearAll button
      UICtrl.clearBtnShow();

      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // edit item on click
  const itemEditClick = function(e){
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

  // update edited item
  const itemUpdateSubmit = function(e){
    // get item input
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update localstorage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // delete item
  const itemDeleteSubmit = function(e){
    // get durrent item
    const currentItem = ItemCtrl.getCurrentItem();
    // delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    // delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // delete from localstorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    if(localStorage.getItem('items') === '[]'){
      localStorage.removeItem('items');
      UICtrl.hideList();
    };

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // clear all items
  const clearAllItemsClick = function(){
    // delete all items from data structure
    ItemCtrl.clearAllItems();
    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // remove all items from UI
    UICtrl.removeItems();
    // clear all from localstorage
    StorageCtrl.clearItemsFromStorage();
    // hide clearAll button
    UICtrl.clearBtnShow();
    // hide ul
    UICtrl.hideList();
  }

  // Public methods
  return {
    init: function(){
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
})(ItemCtrl, StorageCtrl, UICtrl);

// Init App
App.init();
