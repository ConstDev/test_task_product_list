(async () => {
    const rootElement = document.querySelector("#root");
    const CLASS_FOR_SELECTED_ITEM = "selected_item";
    /** Print error message */
    const showErrorMessage = (text) => {
        rootElement.innerHTML = `<h1 class="error_msg">${text}</h1>`
    };
   /** Func for retrieving data */
    const getProductsFromApi = async () => {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      if (response.status === 200) {
          return response.json();
      }
      showErrorMessage(`Something went wrong ${response.status}`);
      throw new Error("Request was failed");
    };
    /** Check is valid URL or not */
    const isUrlValid = (text) => {
        try {
          new URL(text);
          return true;
        } catch (err) {
          return false;
        }
    }
    /** Func for displaying data */
    const drawTableByData = (data) => {
        if (!data.length) {
            showErrorMessage("List is empty");
            return;
        }
        let list = '<div class="flex-container">';
        list += data.map(item => 
                    `<div class="product_item">
                        <div class="item_point">
                            <img id="img_${item.id}" class="item_image" src="${
                                isUrlValid(item.images[0]) ?
                                    item.images[0] :
                                    "https://placehold.co/600x400"}"
                                alt="${item.title}"
                            />
                        </div>
                        ${
                            [
                                { titleName: "Title", itemText: item.title },
                                { titleName: "Price", itemText: item.price },
                                { titleName: "Decription", itemText: item.description.split(".")[0] }
                            ].map(point => `<div class="item_point">
                                                <span class="item_title">${point.titleName}: </span>
                                                ${point.itemText}
                                            </div>`
                                ).join("")
                        }
                        <div class="item_point">
                            <button class="item_btn"></button>
                        </div>
                    </div>`
                ).join("");
        list += "</div>";
        rootElement.innerHTML = list;
    };
    /** Add / remove to/ from favourites */
    const buttonSwitcher = (button, data) => {
        const itemImageClassList = document.querySelector(`#img_${data.id}`).classList;
        const status = localStorage.getItem(data.id) ?
                {
                    title: "Remove from favourites",
                    changeImageClass: () => itemImageClassList.add(CLASS_FOR_SELECTED_ITEM), 
                    action: () => localStorage.removeItem(data.id),
                } :
                {
                    title: "Add to favourites",
                    changeImageClass: () => itemImageClassList.remove(CLASS_FOR_SELECTED_ITEM),
                    action: () => localStorage.setItem(data.id, data.title)
                };
        button.textContent = status.title;
        status.changeImageClass();
        button.addEventListener('click', (e) => {
            status.action();
            buttonSwitcher(button, data);
        });
    };
    // Implementation
    const data = await getProductsFromApi();
    drawTableByData(data);
    document.querySelectorAll(".item_btn")
        .forEach((button, index) => buttonSwitcher(button, data[index]));
  })();
  