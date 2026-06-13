let currentPage = 1;
let pageSize = 10;
let totalPage = 1;
let allDealers = [];
let allProducts = [];

let selectedDealerId = null;
let selectedProductId = null;

$(function () {
    loadOrderList();
    loadDealers();
    loadProducts();
    bindEvents();
});

function bindEvents() {
    $("#openAddOrder").click(function () {
        $("#orderForm")[0].reset();
        selectedDealerId = null;
        selectedProductId = null;
        $("#dealerId").val("");
        $("#productId").val("");
        $("#dealerPanel, #productPanel").hide();
        $("#addModal").fadeIn();
    });

    $(".btn-cancel").click(function () {
        $(".mask").fadeOut();
        $("#dealerPanel, #productPanel").hide();
    });

    // ========== 经销商搜索 ==========
    $(document).on("input", "#dealerSearch", function () {
        selectedDealerId = null;
        $("#dealerId").val("");
        searchDealer();
    });
    $(document).on("blur", "#dealerSearch", function () {
        setTimeout(() => {
            if (!selectedDealerId) {
            $("#dealerSearch").val("");
            $("#dealerId").val("");
        }
        $("#dealerPanel").hide();
    }, 200);
    });

    // ========== 产品搜索 ==========
    $(document).on("input", "#productSearch", function () {
        selectedProductId = null;
        $("#productId").val("");
        searchProduct();
    });
    $(document).on("blur", "#productSearch", function () {
        setTimeout(() => {
            if (!selectedProductId) {
            $("#productSearch").val("");
            $("#productId").val("");
            $("#price").val("");
        }
        $("#productPanel").hide();
    }, 200);
    });

    // 计算金额相关
    $("#quantity, #price, #expectRate").on("input", calcAll);
    $("#realRate").on("input", calcBalanceFee);
    $("#edit_quantity, #edit_price, #edit_expectRate").on("input", calcEditAll);
    $("#edit_realRate").on("input", calcEditBalance);

    // 点击空白关闭所有下拉面板
    $(document).click(function (e) {
        if (!$(e.target).closest("#dealerSearch, #dealerPanel").length) {
            $("#dealerPanel").hide();
        }
        if (!$(e.target).closest("#productSearch, #productPanel").length) {
            $("#productPanel").hide();
        }
    });

    // 新增提交
    $("#orderForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            dealerId: $("#dealerId").val(),
            productId: $("#productId").val(),
            orderDate: $("input[name=orderDate]").val(),
            productName: $("#productSearch").val(),
            quantity: $("input[name=quantity]").val(),
            giftQuantity: $("input[name=giftQuantity]").val(),
            price: $("input[name=price]").val(),
            totalAmount: $("#totalAmount").val(),
            expectRate: $("#expectRate").val(),
            marketFee: $("#marketFee").val(),
            realRate: $("#realRate").val(),
            balanceFee: $("#balanceFee").val()
        };

        $.ajax({
            url: "/api/order/add",
            type: "POST",
            data: formData,
            success: function () {
                alert("保存成功！");
                location.reload();
            },
            error: function () {
                alert("提交失败");
            }
        });
    });

    // 编辑回显
    $(document).on("click", ".edit-btn", function () {
        let tr = $(this).closest("tr");
        let id = tr.find(".data-id").text();
        $.get("/api/order/getOrderInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#edit_id").val(data.id);
            $("#edit_dealerId").val(data.dealerId);
            $("#edit_productId").val(data.productId);
            // 回显到搜索框（不是只读框）
            $("#edit_dealerSearch").val(data.dealerName);
            $("#edit_productSearch").val(data.productName);
            $("#edit_orderDate").val(data.orderDate ? data.orderDate.split('T')[0] : '');
            $("#edit_quantity").val(data.quantity);
            $("#edit_giftQuantity").val(data.giftQuantity);
            $("#edit_price").val(data.price);
            $("#edit_expectRate").val(data.expectRate);
            $("#edit_realRate").val(data.realRate);
            calcEditAll();
            $("#editModal").fadeIn();
        });
    });

    // ---------- 编辑页 - 经销商搜索 ----------
    $(document).on("input", "#edit_dealerSearch", function () {
        searchDealer("edit"); // 区分新增/编辑
    });
    $(document).on("blur", "#edit_dealerSearch", function () {
        setTimeout(() => $("#edit_dealerPanel").hide(), 200);
    });

// ---------- 编辑页 - 产品搜索 ----------
    $(document).on("input", "#edit_productSearch", function () {
        searchProduct("edit");
    });
    $(document).on("blur", "#edit_productSearch", function () {
        setTimeout(() => $("#edit_productPanel").hide(), 200);
    });

    // 编辑提交
    $("#editForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            id: $("#edit_id").val(),
            dealerId: $("#edit_dealerId").val(),
            productId: $("#edit_productId").val(),
            orderDate: $("#edit_orderDate").val(),
            productName: $("#edit_productName").val(),
            quantity: $("#edit_quantity").val(),
            giftQuantity: $("#edit_giftQuantity").val(),
            price: $("#edit_price").val(),
            totalAmount: $("#edit_totalAmount").val(),
            expectRate: $("#edit_expectRate").val(),
            marketFee: $("#edit_marketFee").val(),
            realRate: $("#edit_realRate").val(),
            balanceFee: $("#edit_balanceFee").val()
        };

        $.post("/api/order/update", formData, function () {
            alert("修改成功！");
            location.reload();
        });
    });

    // 删除
    $(document).on("click", ".del-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        if (confirm("确定删除该订单？")) {
            $.get("/api/order/delete?id=" + id, function () {
                loadOrderList();
            });
        }
    });

    // 分页
    $("#first").click(() => {
        currentPage = 1;
    loadOrderList();
});
    $("#prev").click(() => {
        if (currentPage > 1) currentPage--;
    loadOrderList();
});
    $("#next").click(() => {
        if (currentPage < totalPage) currentPage++;
    loadOrderList();
});
    $("#last").click(() => {
        currentPage = totalPage;
    loadOrderList();
});

    $("#pageSizeSelect").change(function () {
        pageSize = $(this).val();
        currentPage = 1;
        loadOrderList();
    });
}

// 编辑页自动计算
function calcEditAll() {
    let qty = Number($("#edit_quantity").val() || 0);
    let price = Number($("#edit_price").val() || 0);
    let total = qty * price;
    $("#edit_totalAmount").val(total.toFixed(2));

    let rate = Number($("#edit_expectRate").val() || 0);
    $("#edit_marketFee").val((total * rate / 100).toFixed(2));
    calcEditBalance();
}
function calcEditBalance() {
    let market = Number($("#edit_marketFee").val() || 0);
    let real = Number($("#edit_realRate").val() || 0);
    $("#edit_balanceFee").val((market * (1 - real / 100)).toFixed(2));
}

// 经销商搜索
// ---------- 编辑页 - 经销商搜索 ----------
$(document).on("input", "#edit_dealerSearch", function () {
    searchDealer("edit"); // 区分新增/编辑
});
$(document).on("blur", "#edit_dealerSearch", function () {
    setTimeout(() => $("#edit_dealerPanel").hide(), 200);
});

// ---------- 编辑页 - 产品搜索 ----------
$(document).on("input", "#edit_productSearch", function () {
    searchProduct("edit");
});
$(document).on("blur", "#edit_productSearch", function () {
    setTimeout(() => $("#edit_productPanel").hide(), 200);
});
// 经销商搜索（支持新增/编辑）
function searchDealer(mode = "add") {
    let key = (mode === "add" ? $("#dealerSearch") : $("#edit_dealerSearch")).val().toLowerCase().trim();
    let panel = mode === "add" ? $("#dealerPanel") : $("#edit_dealerPanel");
    panel.empty().show();
    if (allDealers.length === 0) {
        panel.append('<div class="dealer-item">暂无经销商</div>');
        return;
    }
    let list = allDealers.filter(item => item.dealerName?.toLowerCase().includes(key));
    if (list.length === 0) {
        panel.append('<div class="dealer-item">未找到匹配</div>');
    } else {
        list.forEach(item => {
            panel.append(`<div class="dealer-item" onclick="selectDealer(${item.id},'${item.dealerName}','${mode}')">${item.dealerName}</div>`);
    });
    }
}
function selectDealer(id, name, mode = "add") {
    if (mode === "add") {
        $("#dealerSearch").val(name);
        $("#dealerId").val(id);
        $("#dealerPanel").hide();
    } else {
        $("#edit_dealerSearch").val(name);
        $("#edit_dealerId").val(id);
        $("#edit_dealerPanel").hide();
    }
}
// 产品搜索
function searchProduct() {
    let key = $("#productSearch").val().toLowerCase().trim();
    let panel = $("#productPanel").empty();
    panel.show();
    if (allProducts.length === 0) {
        panel.append('<div class="product-item">暂无产品</div>');
        return;
    }
    let list = allProducts.filter(item => item.productName?.toLowerCase().includes(key));
    if (list.length === 0) {
        panel.append('<div class="product-item">未找到匹配</div>');
    } else {
        list.forEach(item => {
            panel.append(`<div class="product-item" onclick="selectProduct(${item.id},'${item.productName}', ${item.price})">${item.productName}</div>`);
    });
    }
}

// 选中产品：自动回填单价
function selectProduct(id, name, price) {
    selectedProductId = id;
    $("#productSearch").val(name);
    $("#productId").val(id);
    // 自动填充单价
    $("#price").val(parseFloat(price).toFixed(2));
    $("#productPanel").hide();
    // 重新计算金额
    calcAll();
}

// 金额计算
function calcAll() {
    let qty = Number($("#quantity").val() || 0);
    let price = Number($("#price").val() || 0);
    let total = qty * price;
    $("#totalAmount").val(total.toFixed(2));
    let rate = Number($("#expectRate").val() || 0);
    $("#marketFee").val((total * rate / 100).toFixed(2));
    calcBalanceFee();
}
function calcBalanceFee() {
    let marketFee = Number($("#marketFee").val() || 0);
    let realRate = Number($("#realRate").val() || 0);
    $("#balanceFee").val((marketFee * (1 - realRate / 100)).toFixed(2));
}

// 加载经销商列表
function loadDealers() {
    $.get("/api/dealer/all", res => allDealers = res);
}

// 加载产品列表（产品配置接口）
function loadProducts() {
    $.get("/api/productConfig/all", res => allProducts = res);
}

// 加载订单列表
function loadOrderList() {
    $.get("/api/order/list", { pageNum: currentPage, pageSize: pageSize }, res => {
        let html = "";
    res.list.forEach((item, index) => {
        html += `
            <tr>
                <td class="data-id" style="display:none">${item.id}</td>
                <td>${index + 1}</td>
                <td>${item.orderDate ? new Date(item.orderDate).toISOString().split('T')[0] : ''}</td>
                <td>${item.dealerName}</td>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.totalAmount}</td>
                <td>${item.expectRate}</td>
                <td>${item.marketFee}</td>
                <td>
                    <button class="btn btn-edit edit-btn">编辑</button>
                    <button class="btn btn-del del-btn">删除</button>
                </td>
            </tr>`;
});
    $("#orderTable").html(html);
    $("#total").text(res.total);
    totalPage = res.pages;
    $("#pageInfo").text("第 " + currentPage + " / " + totalPage + " 页");
});
}

// 订单详情
function openDetail(id) {
    $.get("/api/order/getById", { id }, data => {
        $("#detailDealerName").val(data.dealerName);
    $("#detailOrderDate").val(data.orderDate ? new Date(data.orderDate).toISOString().split('T')[0] : '');
    $("#detailProductName").val(data.productName);
    $("#detailQuantity").val(data.quantity);
    $("#detailPrice").val(data.price);
    $("#detailTotalAmount").val(data.totalAmount);
    $("#detailMarketFee").val(data.marketFee);
    $("#detailExpectRate").val(data.expectRate);
    $("#detailModal").fadeIn();
});
}