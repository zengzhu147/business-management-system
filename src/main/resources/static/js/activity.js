// 分页全局变量
let currentPage = 1;
let pageSize = 10;
let totalPage = 1;

// 数据源
let allDealers = [];
let allActivityType = [];

// 选中ID
let selectedDealerId = null;
let selectedActivityTypeId = null;

$(function () {
    loadActivityList();
    loadDealers();
    loadActivityType();
    bindEvents();
});

// 绑定所有事件
function bindEvents() {
    // 打开新增弹窗
    $("#openAddActivity").click(function () {
        $("#activityForm")[0].reset();
        selectedDealerId = null;
        selectedActivityTypeId = null;
        $("#dealerId").val("");
        $("#activityTypeId").val("");
        $("#dealerPanel, #activityTypePanel").hide();
        $("#addModal").fadeIn();
    });

    // 关闭弹窗
    $(".btn-cancel").click(function () {
        $(".mask").fadeOut();
        $("#dealerPanel, #activityTypePanel").hide();
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

    // 点击页面空白处关闭下拉面板
    $(document).click(function (e) {
        if (!$(e.target).closest("#dealerSearch, #dealerPanel").length) {
            $("#dealerPanel").hide();
        }
        if (!$(e.target).closest("#activityTypeSearch, #activityTypePanel").length) {
            $("#activityTypePanel").hide();
        }
    });

    // ========== 新增提交 ==========
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

    // ========== 打开编辑弹窗 ==========
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

    // ========== 编辑提交 ==========
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

    // ========== 删除 ==========
    $(document).on("click", ".del-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        if (confirm("确定删除该活动？")) {
            $.get("/api/activity/delete?id=" + id, function () {
                loadActivityList();
            });
        }
    });

    // ========== 打开详情 ==========
    $(document).on("click", ".view-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        openDetail(id);
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

// 加载所有活动类型（从活动配置接口获取）
function loadActivityType() {
    $.get("/api/activityConfig/all", res => allActivityType = res);
}

// 加载活动列表
function loadActivityList() {
    $.get("/api/activity/list", { pageNum: currentPage, pageSize: pageSize }, res => {
        let html = "";
        res.list.forEach((item, index) => {
            html += `
            <tr>
                <td class="data-id" style="display:none">${item.id}</td>
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
                </td>
            </tr>`;
        });
        $("#activityTable").html(html);
        $("#total").text(res.total);
        totalPage = res.pages;
        $("#pageInfo").text("第 " + currentPage + " / " + totalPage + " 页");
    });
}

// 打开详情弹窗
function openDetail(id) {
    $.get("/api/activity/getById", { id }, data => {
        $("#detail_activityType").val(data.activityType);
        $("#detail_dealerName").val(data.dealerName);
        $("#detail_activityTime").val(data.activityTime ? new Date(data.activityTime).toISOString().split('T')[0] : '');
        $("#detail_applyFee").val(data.applyFee);
        $("#detail_writeOffStatus").val(data.writeOffStatus);
        $("#detail_activityContent").val(data.activityContent);
        $("#detailModal").fadeIn();
    });
}