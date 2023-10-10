# Multi-Level Dropdown

## Introduction

The Multi-Level Dropdown is a JavaScript-based component that provides a hierarchical menu system with multiple levels of submenus. This component allows you to create interactive dropdown menus with dynamic content.

## Features

- **Nested Menus:** Create multi-level dropdown menus with nested submenus.
- **Customizable:** Customize the appearance and behavior of the dropdown menus to match your website's design and functionality.
- **Dynamic Content:** Populate the menus with dynamic content and data.
- **Auto Direction:** Automatically determine the optimal direction (left, right, top, or bottom) for submenu placement based on the available space in the viewport.

## Getting Started

To use the Multi-Level Dropdown component in your HTML document, follow these steps:

1. Include the necessary HTML structure for your dropdown buttons:

```html
<div style="position:absolute;left:0;top:0">
    <button id="dropdownelement0">Dropdown</button>
</div>
```
2. Initialize the plugin :

```html 
<script>
 
    // Create an instance of the Multi-Level Dropdown component for each button
    const options = {
        data: [
            { html: 'a', children: [{ html: 'a.a' }, { html: 'a.b' }] },
            {
                html: 'b',
                children: [
                    { html: 'b.a' },
                    { html: 'b.b', children: [{ html: 'b.b.a' }, { html: 'b.b.b' }] },
                ],
            },
        ],
         model: (item) => { return `${item.html}`; }, // Optional function for customizing the text displayed in menu items.
        nodeClick: (e, item, dropdown) => { // Optional function to handle item clicks.
        console.log(e, item, dropdown);
    }
    };
 

    new Dropdown(document.querySelector('#dropdownelement0'), options);
    // Initialize more instances for other buttons as needed
</script>
```

```javascript   
let asyncDataOptions ={
 
        data:(caller,callback)=>{ 
        //console.log("Asyncronously get options.data here "); 
       
            // demo timeout 
            setTimeout(()=>{
            let asyncronouslyRetrievedData= [ 
                { html: 'a', children: [{ html: 'a.a' }, { html: 'a.b' }] },
                { html: 'b', children: [{ html: 'b.a' }, { html: 'b.b' }] }
                ];
            callback(caller, asyncronouslyRetrievedData );
            },800);

       }
       };
 new Dropdown(document.querySelector('#dropdownelement0'), asyncDataOptions);

```
 ## Options

The `MultiLevelDropdown` constructor accepts the following options:
- `data`: This option can be either an array of menu items or a callback function. If it's an array, it should contain the structure of your dropdown menu. If it's a callback function, it should take three parameters: `e` (the click event), `item` (the clicked menu item), and `dropdown` (the dropdown instance). You can use this callback to fetch or generate the menu items dynamically.

- `direction`:(Optional) Specifies the initial direction in which the dropdown menu will appear. It can be set to `'auto'`, `{x:'auto',y:'auto'}`, `{x:'right',y:'bottom'}`, or other combinations. The dropdown will automatically position itself based on the available space if set to `'auto'`. Default: `'auto'`.

- `model`: (Optional) This is a function that allows you to customize the text displayed for each menu item. It takes an `item` as an argument and should return a string that represents the text for the menu item. By default, it displays the `html` property of the item.

- `nodeClick`: (Optional) This is a callback function that is triggered when a menu item is clicked. It can be set to `null` or a custom function. If set to `null`, no action is taken when a menu item is clicked. If provided, it should be a function that takes three arguments: `e` (the click event), `item` (the clicked menu item), and `dropdown` (the dropdown instance). You can customize this function to perform specific actions when a menu item is clicked.



