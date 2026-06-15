// 分页全局变量
let currentPage = 1;
let pageSize = 10;
let totalPage = 1;

// 数据源
let allDealers = [];
let allActivityType = [];
let allProducts = [];

// 选中ID
let selectedDealerId = null;
let selectedActivityTypeId = null;
let selectedProductId = null;

$(function () {
    loadActivityList();
    loadDealers();
    loadActivityType();
    loadProducts();
    bindEvents();
});

// 绑定所有事件
function bindEvents() {
    // 打开新增活动弹窗
    $("#openAddActivity").click(function () {
        $("#activityForm")[0].reset();
        selectedDealerId = null;
        selectedActivityTypeId = null;
        $("#dealerId").val("");
        $("#activityTypeId").val("");
        $("#dealerPanel, #activityTypePanel").hide();
        $("#addModal").fadeIn();
    });

    // 关闭所有弹窗 + 隐藏下拉面板
    $(".btn-cancel").click(function () {
        $(".mask").fadeOut();
        $("#dealerPanel, #activityTypePanel, #writeOff_productPanel").hide();
    });

    // ========== 1. 活动类型 模糊搜索 ==========
    $(document).on("input", "#activityTypeSearch", function () {
        selectedActivityTypeId = null;
        $("#activityTypeId").val("");
        searchActivityType();
    });
    $(document).on("blur", "#activityTypeSearch", function () {
        setTimeout(() => {
            if (!selectedActivityTypeId) {
            $("#activityTypeSearch").val("");
            $("#activityTypeId").val("");
        }
        $("#activityTypePanel").hide();
    }, 200);
    });

    // ========== 2. 经销商 模糊搜索 ==========
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

    // ========== 3. 核销弹窗 - 产品搜索 ==========
    $(document).on("input", "#writeOff_productSearch", function () {
        selectedProductId = null;
        $("#writeOff_productId").val("");
        searchProduct();
    });
    $(document).on("blur", "#writeOff_productSearch", function () {
        setTimeout(() => {
            if (!selectedProductId) {
            $("#writeOff_productSearch").val("");
            $("#writeOff_productId").val("");
        }
        $("#writeOff_productPanel").hide();
    }, 200);
    });

    // 点击空白关闭所有下拉面板
    $(document).click(function (e) {
        if (!$(e.target).closest("#dealerSearch, #dealerPanel").length) $("#dealerPanel").hide();
        if (!$(e.target).closest("#activityTypeSearch, #activityTypePanel").length) $("#activityTypePanel").hide();
        if (!$(e.target).closest("#writeOff_productSearch, #writeOff_productPanel").length) $("#writeOff_productPanel").hide();
    });

    // ========== 核销费用自动计算：数量 / 单价变化时计算 ==========
    $(document).on("input", "#writeOff_num, #writeOff_price", calcWriteOffTotal);

    // ========== 新增活动提交 ==========
    $("#activityForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            activityTypeId: $("#activityTypeId").val(),
            dealerId: $("#dealerId").val(),
            activityTime: $("input[name=activityTime]").val(),
            applyFee: $("input[name=applyFee]").val(),
            writeOffStatus: $("select[name=writeOffStatus]").val(),
            activityContent: $("textarea[name=activityContent]").val()
        };
        $.ajax({
            url: "/api/activity/add",
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

    // ========== 打开编辑活动弹窗 ==========
    $(document).on("click", ".edit-btn", function () {
        let tr = $(this).closest("tr");
        let id = tr.find(".data-id").text();
        $.get("/api/activity/getActivityInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#edit_id").val(data.id);
            $("#edit_activityTypeId").val(data.activityTypeId);
            $("#edit_activityType").val(data.activityType);
            $("#edit_dealerId").val(data.dealerId);
            $("#edit_dealerName").val(data.dealerName);
            $("#edit_activityTime").val(data.activityTime ? data.activityTime.split('T')[0] : '');
            $("#edit_applyFee").val(data.applyFee);
            $("#edit_writeOffStatus").val(data.writeOffStatus);
            $("#edit_activityContent").val(data.activityContent);
            $("#editModal").fadeIn();
        });
    });

    // ========== 编辑活动提交 ==========
    $("#editActivityForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            id: $("#edit_id").val(),
            activityTypeId: $("#edit_activityTypeId").val(),
            dealerId: $("#edit_dealerId").val(),
            activityTime: $("#edit_activityTime").val(),
            applyFee: $("#edit_applyFee").val(),
            writeOffStatus: $("#edit_writeOffStatus").val(),
            activityContent: $("#edit_activityContent").val()
        };
        $.post("/api/activity/update", formData, function () {
            alert("修改成功！");
            location.reload();
        });
    });

    // ========== 删除活动 ==========
    $(document).on("click", ".del-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        if (confirm("确定删除该活动？")) {
            $.get("/api/activity/delete?id=" + id, function () {
                loadActivityList();
            });
        }
    });

    // ========== 打开活动详情 ==========
    $(document).on("click", ".view-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        openDetail(id);
    });

    // ========== 打开新增核销弹窗 ==========
    $(document).on("click", ".writeoff-btn", function () {
        let tr = $(this).closest("tr");
        let activityId = tr.find(".data-id").text();
        let dealerName = tr.find("td:nth-child(6)").text();
        let dealerId = tr.data("dealerid");

        $("#writeOffForm")[0].reset();
        selectedProductId = null;
        $("#writeOff_activityId").val(activityId);
        $("#writeOff_dealerId").val(dealerId);
        $("#writeOff_dealerName").val(dealerName);
        $("#writeOff_productSearch").val("");
        $("#writeOff_productId").val("");
        $("#writeOff_total").val("");
        $("#writeOffModal").fadeIn();
    });

    // ========== 核销提交 ==========
    $("#writeOffForm").submit(function (e) {
        e.preventDefault();
        let formData = {
            activityId: $("#writeOff_activityId").val(),
            dealerId: $("#writeOff_dealerId").val(),
            productId: $("#writeOff_productId").val(),
            writeOffTime: $("input[name=writeOffTime]").val(),
            num: $("#writeOff_num").val(),
            writeOffPrice: $("#writeOff_price").val(),
            writeOffTotal: $("#writeOff_total").val()
        };
        $.post("/api/writeOff/add", formData, function () {
            alert("核销提交成功！");
            $(".mask").fadeOut();
            loadActivityList();
        }, function () {
            alert("核销提交失败！");
        });
    });

    // ========== 展开/收起核销列表 ==========
    $(document).on("click", ".expand-btn", function () {
        let $btn = $(this);
        let $currTr = $btn.closest("tr");
        let activityId = $currTr.find(".data-id").text();
        let $nextTr = $currTr.next(".writeoff-wrap");

        if ($nextTr.length > 0) {
            $nextTr.remove();
            $btn.text("+");
        } else {
            $btn.text("-");
            loadWriteOffList(activityId, $currTr);
        }
    });

    // ========== 分页事件 ==========
    $("#first").click(() => {
        currentPage = 1;
    loadActivityList();
});
    $("#prev").click(() => {
        if (currentPage > 1) currentPage--;
    loadActivityList();
});
    $("#next").click(() => {
        if (currentPage < totalPage) currentPage++;
    loadActivityList();
});
    $("#last").click(() => {
        currentPage = totalPage;
    loadActivityList();
});

    // 每页条数切换
    $("#pageSizeSelect").change(function () {
        pageSize = $(this).val();
        currentPage = 1;
        loadActivityList();
    });
}

// 自动计算核销费用
function calcWriteOffTotal() {
    let num = Number($("#writeOff_num").val() || 0);
    let price = Number($("#writeOff_price").val() || 0);
    let total = num * price;
    $("#writeOff_total").val(total.toFixed(2));
}

// ========== 产品搜索 ==========
function searchProduct() {
    let key = $("#writeOff_productSearch").val().toLowerCase().trim();
    let panel = $("#writeOff_productPanel").empty().show();
    if (allProducts.length === 0) {
        panel.append('<div class="select-item">暂无产品</div>');
        return;
    }
    let list = allProducts.filter(item => item.productName?.toLowerCase().includes(key));
    if (list.length === 0) {
        panel.append('<div class="select-item">未找到匹配</div>');
    } else {
        list.forEach(item => {
            panel.append(`<div class="select-item" onclick="selectProduct(${item.id},'${item.productName}')">${item.productName}</div>`);
    });
    }
}
// 选中产品
function selectProduct(id, name) {
    selectedProductId = id;
    $("#writeOff_productSearch").val(name);
    $("#writeOff_productId").val(id);
    $("#writeOff_productPanel").hide();
}

// ========== 活动类型 搜索 ==========
function searchActivityType() {
    let key = $("#activityTypeSearch").val().toLowerCase().trim();
    let panel = $("#activityTypePanel").empty();
    panel.show();
    if (allActivityType.length === 0) {
        panel.append('<div class="select-item">暂无活动类型</div>');
        return;
    }
    let list = allActivityType.filter(item => item.activityType?.toLowerCase().includes(key));
    if (list.length === 0) {
        panel.append('<div class="select-item">未找到匹配</div>');
    } else {
        list.forEach(item => {
            panel.append(`<div class="select-item" onclick="selectActivityType(${item.id},'${item.activityType}')">${item.activityType}</div>`);
    });
    }
}
// 选中活动类型
function selectActivityType(id, name) {
    selectedActivityTypeId = id;
    $("#activityTypeSearch").val(name);
    $("#activityTypeId").val(id);
    $("#activityTypePanel").hide();
}

// ========== 经销商 搜索 ==========
function searchDealer() {
    let key = $("#dealerSearch").val().toLowerCase().trim();
    let panel = $("#dealerPanel").empty();
    panel.show();
    if (allDealers.length === 0) {
        panel.append('<div class="select-item">暂无经销商</div>');
        return;
    }
    let list = allDealers.filter(item => item.dealerName?.toLowerCase().includes(key));
    if (list.length === 0) {
        panel.append('<div class="select-item">未找到匹配</div>');
    } else {
        list.forEach(item => {
            panel.append(`<div class="select-item" onclick="selectDealer(${item.id},'${item.dealerName}')">${item.dealerName}</div>`);
    });
    }
}
// 选中经销商
function selectDealer(id, name) {
    selectedDealerId = id;
    $("#dealerSearch").val(name);
    $("#dealerId").val(id);
    $("#dealerPanel").hide();
}

// 加载所有经销商
function loadDealers() {
    $.get("/api/dealer/all", res => allDealers = res);
}
// 加载所有活动类型
function loadActivityType() {
    $.get("/api/activityConfig/all", res => allActivityType = res);
}
// 加载所有产品
function loadProducts() {
    $.get("/api/productConfig/all", res => allProducts = res);
}

// 加载活动列表
function loadActivityList() {
    $.get("/api/activity/list", { pageNum: currentPage, pageSize: pageSize }, res => {
        let html = "";
    res.list.forEach((item, index) => {
        html += `
            <tr data-dealerid="${item.dealerId}">
                <td class="data-id" style="display:none">${item.id}</td>
                <td><button class="expand-btn">+</button></td>
                <td>${index + 1}</td>
                <td>${item.activityTime ? new Date(item.activityTime).toISOString().split('T')[0] : ''}</td>
                <td>${item.activityType}</td>
                <td>${item.dealerName}</td>
                <td>${item.activityContent}</td>
                <td>${item.applyFee}</td>
                <td>${item.writeOffStatus === 'Y' ? '是' : '否'}</td>
                <td>
                    <button class="btn btn-edit edit-btn">编辑</button>
                    <button class="btn btn-del del-btn">删除</button>
                    <button class="btn btn-writeoff writeoff-btn">新增核销</button>
                </td>
            </tr>`;
});
    $("#activityTable").html(html);
    $("#total").text(res.total);
    totalPage = res.pages;
    $("#pageInfo").text("第 " + currentPage + " / " + totalPage + " 页");
});
}

// 加载当前活动对应的核销明细（模板适配新层级样式）
function loadWriteOffList(activityId, $tr) {
    $.get("/api/writeOff/getWriteOffInfo", { activityId: activityId }, res => {
        let writeHtml = `
        <tr class="writeoff-wrap">
            <td colspan="9">
                <div class="writeoff-inner-box">
                    <table class="writeoff-table">
                        <thead>
                            <tr>
                                <th width="15%">核销时间</th>
                                <th width="20%">经销商名称</th>
                                <th width="20%">产品名称</th>
                                <th width="10%">数量</th>
                                <th width="15%">核销单价</th>
                                <th width="20%">核销费用</th>
                            </tr>
                        </thead>
                        <tbody>`;
    if (res.list && res.list.length > 0) {
        res.list.forEach(item => {
            writeHtml += `
                <tr class="writeoff-row">
                    <td>${item.writeOffTime ? item.writeOffTime.split('T')[0] : ''}</td>
                    <td>${item.dealerName}</td>
                    <td>${item.productName}</td>
                    <td>${item.num}</td>
                    <td>${item.writeOffPrice}</td>
                    <td>${item.writeOffTotal}</td>
                </tr>`;
    });
    } else {
        writeHtml += `<tr class="writeoff-row"><td colspan="6" style="text-align:center;">暂无核销数据</td></tr>`;
    }
    writeHtml += `
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>`;
    $tr.after(writeHtml);
});
}

// 打开活动详情弹窗
function openDetail(id) {
    $.get("/api/activity/getById", { id }, data => {
        $("#detail_activityType").val(data.activityType);
    $("#detail_dealerName").val(data.dealerName);
    $("#detail_activityTime").val(data.activityTime ? new Date(data.activityTime).split('T')[0] : '');
    $("#detail_applyFee").val(data.applyFee);
    $("#detail_writeOffStatus").val(data.writeOffStatus === 'Y' ? '是' : '否');
    $("#detail_activityContent").val(data.activityContent);
    $("#detailModal").fadeIn();
});
}