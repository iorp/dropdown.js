const NAMESPACE = 'Dropdown';


window[NAMESPACE] ={
  Plugin: class {
  constructor(element, options) {
    this.element = element;
    this.options = Object.assign({
      
      direction: 'auto', // {x:'auto',y:'auto'} // {x:'right',y:'bottom'},
      model: (item) => { return `${item.html}`; },
      nodeClick: null //()=>{}
    }, options);

    this.init();

    // Add the click event listener to the body element
    window.removeEventListener('click', this.windowClickEventHandler, true);
    window.addEventListener('click', this.windowClickEventHandler, true);
  }
  init(){
    if(typeof this.options.data ==='function'){
   
     this.options.data(this,this.start); 

    }else{
     
      this.start(this,this.options.data);
      }
    
  }
  start(caller, data) { 
     caller.options.data = data;
    // Init Direction
    (() => {
      // stablish direction
      if (caller.options.direction == 'auto') caller.options.direction = { x: 'auto', y: 'auto' };

      if (caller.options.direction.x == 'auto' || caller.options.direction.y == 'auto') {
        let auto = (() => {
          // Get the element's position relative to the viewport
          const rect = caller.element.getBoundingClientRect();

          // Get the viewport dimensions
          const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

          // Calculate the element's distance from the left and top of the viewport
          const distanceLeft = rect.left;
          const distanceTop = rect.top;

          // Calculate the element's distance from the right and bottom of the viewport
          const distanceRight = viewportWidth - rect.right;
          const distanceBottom = viewportHeight - rect.bottom;

          // Determine if the element is closer to the left or right
          return {
            x: distanceLeft < distanceRight ? 'right' : 'left',
            y: distanceTop < distanceBottom ? 'bottom' : 'top',
          };
        })();
        caller.options.direction.x = (caller.options.direction.x == 'auto') ? auto.x : caller.options.direction.x;
        caller.options.direction.y = (caller.options.direction.y == 'auto') ? auto.y : caller.options.direction.y;
      }
    })();

    // Create the new ul element
    caller.dropdown = document.createElement('ul');
    caller.dropdown.className = 'dropdown-js-menu dropdown-js-dir-' + caller.options.direction.x + ' dropdown-js-dir-' + caller.options.direction.y;
    caller.element.insertAdjacentElement('afterend', caller.dropdown);
    caller.element.className = "dropdown-js-button " + (caller.element.className || '');

    // initialize
    const button = caller.element;
    const dropdownMenu = caller.element.nextElementSibling;
    caller.buildSubMenu(caller.options.data, dropdownMenu);

    button.addEventListener('click', () => {

      if (!dropdownMenu.classList.contains('show')) caller.hideLevel(dropdownMenu.parentNode);
      dropdownMenu.classList.toggle('show');
    });
  }

  hide() {
    this.hideLevel(this.element.parentNode);
  }

  buildSubMenu(data, parentElement) {

    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.classList.add('dropdown-js-item');

      const listItemLink = document.createElement('a');
      listItemLink.classList.add('dropdown-js-item-link');
      listItemLink.innerHTML = this.options.model(item);

      listItem.appendChild(listItemLink);

      parentElement.appendChild(listItem);

      if (item.children && item.children.length > 0) {
        listItem.classList.add('has-children');
        const subMenu = document.createElement('ul');
        subMenu.classList.add('dropdown-js-sub-menu');

        listItem.appendChild(subMenu);
        this.buildSubMenu(item.children, subMenu);

        // Toggle submenu on click
        listItem.addEventListener('click', (e) => {
          e.stopPropagation();

          if (!listItem.classList.contains('open')) {
            this.hideLevel(e.target.parentNode);
          }

          listItem.classList.add('open');
          subMenu.classList.add('show');
          if(typeof this.options.nodeClick =='function') this.options.nodeClick(e,item,this);
        });

      } else {

        listItem.addEventListener('click', (e) => {
          e.stopPropagation();
        
          // no children item 

          this.hideLevel(this.element.parentNode);
          if(typeof this.options.nodeClick =='function') this.options.nodeClick(e,item,this);
        });


        listItem.classList.add('no-children');
      }
    });

    if (this.options.direction.y == 'top') window[NAMESPACE].Plugin.reverseChildrenOrder(parentElement);
  }

  // Define the click event handler function
  windowClickEventHandler(event) {
    // check button and menu for click
    let dropdownMenu = window[NAMESPACE].Plugin.closest(event.target, '.dropdown-js-button') ?
      window[NAMESPACE].Plugin.closest(event.target, '.dropdown-js-button').nextElementSibling :
      window[NAMESPACE].Plugin.closest(event.target, 'ul.dropdown-js-menu');

    // Find all ul.dropdown-js-menu elements
    const dropdownMenus = document.querySelectorAll('ul.dropdown-js-menu');

    // Filter out the ones that are not equal to the given element
    const filteredDropdownMenus = Array.from(dropdownMenus).filter(function (menu) { return menu !== dropdownMenu; });
    // hide filtered 
    filteredDropdownMenus.forEach(element => {
      element = element.parentNode;
      window[NAMESPACE].Plugin.recurseMethod(Array.from(element.querySelectorAll('ul.dropdown-js-menu')).concat(Array.from(element.querySelectorAll('ul.dropdown-js-sub-menu'))), (element) => { element.classList.remove('show') });
      window[NAMESPACE].Plugin.recurseMethod(element.querySelectorAll('li.dropdown-js-item'), (element) => { element.classList.remove('open') });

    });
  }

  hideLevel(element) {
    window[NAMESPACE].Plugin.recurseMethod(Array.from(element.querySelectorAll('ul.dropdown-js-menu')).concat(Array.from(element.querySelectorAll('ul.dropdown-js-sub-menu'))), (element) => { element.classList.remove('show') });
    window[NAMESPACE].Plugin.recurseMethod(element.querySelectorAll('li.dropdown-js-item'), (element) => { element.classList.remove('open') });

  }

  static closest(element, selector) {
    let currentElement = element;

    while (currentElement) {
      if (currentElement.matches(selector)) {
        return currentElement;
      }

      currentElement = currentElement.parentElement;
    }

    // If no matching ancestor is found, return null
    return null;
  }

  static recurseMethod(elements, method) {
    elements.forEach((element) => {

      const children = element.children;
      for (const child of children) {
        method(child);
      }

      method(element);
    });
  }

  static reverseChildrenOrder(parentElement) {
    const children = parentElement.children;
    const fragment = document.createDocumentFragment();

    while (children.length > 0) {
      fragment.appendChild(children[children.length - 1]);
    }

    parentElement.appendChild(fragment);
  }
}
}




 if (typeof module !== 'undefined' && module.type === 'module') {
  // The script has been included as a module
  console.log('The script is loaded as a module.');
} else if (typeof jQuery !== 'undefined') {
  // jQuery is loaded
  console.log('jQuery is available on this page.');
} 