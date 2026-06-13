let currentPage = 1;
let pageSize = 10;
let totalPage = 1;
let allDealers = [];
let selectedDealerId = null;

$(function () {
    loadOrderList();
    loadDealers();
    bindEvents();
});

function bindEvents() {
    $("#openAddOrder").click(function () {
        $("#orderForm")[0].reset();
        selectedDealerId = null;
        $("#dealerId").val("");
        $("#dealerPanel").hide();
        $("#addModal").fadeIn();
    });

    $(".btn-cancel").click(function () {
        $(".mask").fadeOut();
        $("#dealerPanel").hide();
    });

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

    $("#quantity, #price, #expectRate").on("input", calcAll);
    $("#realRate").on("input", calcBalanceFee);
    $("#edit_quantity, #edit_price, #edit_expectRate").on("input", calcEditAll);
    $("#edit_realRate").on("input", calcEditBalance);

    $(document).click(function (e) {
        if (!$(e.target).closest("#dealerSearch, #dealerPanel").length) {
            $("#dealerPanel").hide();
        }
    });

    // 新增提交
    $("#orderForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            dealerId: $("#dealerId").val(),
            orderDate: $("input[name=orderDate]").val(),
            productName: $("input[name=productName]").val(),
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

    // 编辑
    $(document).on("click", ".edit-btn", function () {
        let tr = $(this).closest("tr");
        let id = tr.find(".data-id").text();

        $.get("/api/order/getOrderInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#edit_id").val(data.id);
            $("#edit_dealerId").val(data.dealerId);
            $("#edit_dealerName").val(data.dealerName);
            $("#edit_orderDate").val(data.orderDate ? data.orderDate.split('T')[0] : '');
            $("#edit_productName").val(data.productName);
            $("#edit_quantity").val(data.quantity);
            $("#edit_giftQuantity").val(data.giftQuantity);
            $("#edit_price").val(data.price);
            $("#edit_expectRate").val(data.expectRate);
            $("#edit_realRate").val(data.realRate);

            calcEditAll();
            $("#editModal").fadeIn();
        });
    });

    // 编辑提交
    $("#editForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            id: $("#edit_id").val(),
            dealerId: $("#edit_dealerId").val(),
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

    // ✅ 修复这里！！！
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

function searchDealer() {
    let key = $("#dealerSearch").val().toLowerCase().trim();
    let panel = $("#dealerPanel").empty();
    panel.show();
    if (allDealers.length === 0) {
        panel.append('<div class="dealer-item">暂无经销商</div>');
        return;
    }
    let list = allDealers.filter(item => item.dealerName?.toLowerCase().includes(key));
    if (list.length === 0) {
        panel.append('<div class="dealer-item">未找到匹配</div>');
    } else {
        list.forEach(item => {
            panel.append(`<div class="dealer-item" onclick="selectDealer(${item.id},'${item.dealerName}')">${item.dealerName}</div>`);
    });
    }
}

function selectDealer(id, name) {
    selectedDealerId = id;
    $("#dealerSearch").val(name);
    $("#dealerId").val(id);
    $("#dealerPanel").hide();
}

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

function loadDealers() {
    $.get("/api/dealer/all", res => allDealers = res);
}

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