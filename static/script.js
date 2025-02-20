$(document).ready(function () {
    let addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));

    // Existing add and delete functionality (same as before)
    $("#openModalBtn").click(function () {
        let itemName = $("#groceryInput").val().trim();
        if (itemName === "") {
            alert("Please enter an item name first.");
            return;
        }
        $("#modalItemName").val(itemName);
        addItemModal.show();
    });

    $("#saveItemBtn").click(function () {
        let newItem = $("#modalItemName").val();
        let quantity = $("#modalQuantity").val();
        let price = $("#modalPrice").val();
        let category = $("#modalCategory").val();

        if (!quantity || !price) {
            alert("Please enter quantity and price.");
            return;
        }

        $.post("/add", { name: newItem, quantity: quantity, price: price, category: category }, function (data) {
            if (data.success) {
                $("#groceryList").append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center" id="item-${data.index}">
                        <input type="checkbox" class="delete-checkbox" data-index="${data.index}">
                        <strong>${newItem}</strong> (${quantity}, ₹${price}, ${category})
                        <span class="delete-btn" onclick="deleteItem(${data.index})">
                            <i class="fas fa-trash-alt"></i>
                        </span>
                    </li>
                `);
                $("#groceryInput").val("");
                $("#modalQuantity").val("");
                $("#modalPrice").val("");
                addItemModal.hide();
                updateItemCount();
            }
        });
    });

    // Delete individual item
    window.deleteItem = function (index) {
        $.post("/delete", { index: index }, function (data) {
            if (data.success) {
                $(`#item-${index}`).fadeOut(300, function () {
                    $(this).remove();
                    updateItemCount();
                });
            }
        });
    };

    // Update total item count
    function updateItemCount() {
        let itemCount = $("#groceryList li").length;
        $("#itemCount").text(itemCount);
    }

    // Handle deletion of selected items
    $("#deleteSelectedBtn").click(function () {
        $(".delete-checkbox:checked").each(function () {
            let index = $(this).data("index");
            $.post("/delete", { index: index }, function (data) {
                if (data.success) {
                    $(`#item-${index}`).fadeOut(300, function () {
                        $(this).remove();
                        updateItemCount();
                    });
                }
            });
        });
    });

    // Search functionality (same as before)
    window.searchItems = function () {
        let searchQuery = $("#searchInput").val().toLowerCase();
        $("#groceryList li").each(function () {
            let itemText = $(this).text().toLowerCase();
            if (itemText.indexOf(searchQuery) === -1) {
                $(this).fadeOut();
            } else {
                $(this).fadeIn();
            }
        });
    };
});




