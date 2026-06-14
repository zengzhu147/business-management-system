let currentPage = 1;
let pageSize = 10;
let totalPage = 1;
let allDealers = [];
let selectedDealerId = null;

// 活动类型校验状态（对标经销商名称校验）
let addTypeValid = true;
let editTypeValid = true;

$(function () {
    loadList();
    loadDealers();
    bindEvents();
});

// 活动类型重复校验公共方法
/**
 * @param type 活动类型名称
 * @param excludeId 编辑时排除自身ID，新增传空
 * @param callback 回调：true=已存在，false=可用
 */
function checkActivityType(type, excludeId, callback) {
    let params = { activityType: type };
    if (excludeId) {
        params.id = excludeId;
    }
    $.get("/api/activityConfig/checkActivityType", params, function (res) {
        callback(res);
    });
}

function bindEvents() {
    // 打开新增弹窗，重置校验状态
    $("#openAdd").click(function () {
        $("#activityForm")[0].reset();
        selectedDealerId = null;
        $("#dealerId").val("");
        $("#dealerPanel").hide();
        // 重置提示与状态
        addTypeValid = true;
        $("#add_type_tip").hide();
        $("#addModal").fadeIn();
    });

    // 关闭所有弹窗，隐藏错误提示
    $(".btn-cancel").click(function () {
        $(".mask").fadeOut();
        $("#dealerPanel").hide();
        $("#edit_dealerPanel").hide();
        $("#add_type_tip").hide();
        $("#edit_type_tip").hide();
        addTypeValid = true;
        editTypeValid = true;
    });

    // ========== 新增-活动类型 失焦校验 ==========
    $("#add_activityType").blur(function () {
        let type = $.trim($(this).val());
        if (!type) {
            $("#add_type_tip").hide();
            addTypeValid = true;
            return;
        }
        checkActivityType(type, null, function (isExist) {
            if (isExist) {
                $("#add_type_tip").show();
                addTypeValid = false;
            } else {
                $("#add_type_tip").hide();
                addTypeValid = true;
            }
        });
    });

    // ========== 编辑-活动类型 失焦校验 ==========
    $("#edit_activityType").blur(function () {
        let type = $.trim($(this).val());
        let id = $("#edit_id").val();
        if (!type) {
            $("#edit_type_tip").hide();
            editTypeValid = true;
            return;
        }
        checkActivityType(type, id, function (isExist) {
            if (isExist) {
                $("#edit_type_tip").show();
                editTypeValid = false;
            } else {
                $("#edit_type_tip").hide();
                editTypeValid = true;
            }
        });
    });

    // 新增经销商搜索
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

    // 编辑经销商搜索
    $(document).on("input", "#edit_dealerSearch", function () {
        selectedDealerId = null;
        $("#edit_dealerId").val("");
        searchEditDealer();
    });

    $(document).on("blur", "#edit_dealerSearch", function () {
        setTimeout(() => {
            if (!selectedDealerId) {
            $("#edit_dealerSearch").val("");
            $("#edit_dealerId").val("");
        }
        $("#edit_dealerPanel").hide();
    }, 200);
    });

    $(document).click(function (e) {
        if (!$(e.target).closest("#dealerSearch,#dealerPanel,#edit_dealerSearch,#edit_dealerPanel").length) {
            $("#dealerPanel").hide();
            $("#edit_dealerPanel").hide();
        }
    });

    // ========== 新增表单提交（增加类型校验拦截） ==========
    $("#activityForm").submit(function (e) {
        e.preventDefault();
        if (!addTypeValid) {
            alert("该活动类型已存在，请修改！");
            return;
        }
        let formData = $(this).serialize();
        $.post("/api/activityConfig/add", formData, function () {
            alert("保存成功！");
            location.reload();
        });
    });

    // 编辑弹窗打开，重置校验状态
    $(document).on("click", ".edit-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        $.get("/api/activityConfig/getActivityConfigInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#edit_id").val(data.id);
            $("#edit_activityType").val(data.activityType);
            $("#edit_activityComment").val(data.activityComment);

            // 重置编辑校验
            editTypeValid = true;
            $("#edit_type_tip").hide();
            $("#editModal").fadeIn();
        });
    });

    // ========== 编辑表单提交（增加类型校验拦截） ==========
    $("#editForm").submit(function (e) {
        e.preventDefault();
        if (!editTypeValid) {
            alert("该活动类型已存在，请修改！");
            return;
        }
        let formData = $(this).serialize();
        $.post("/api/activityConfig/update", formData, function () {
            alert("修改成功！");
            location.reload();
        });
    });

    // 删除
    $(document).on("click", ".del-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        if (confirm("确定删除？")) {
            $.get("/api/activityConfig/delete?id=" + id, function () {
                loadList();
            });
        }
    });

    // 详情
    $(document).on("click", ".btn-view", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        $.get("/api/activityConfig/getActivityConfigInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#detail_activityType").val(data.activityType);
            $("#detail_activityComment").val(data.activityComment);
            $("#detailModal").fadeIn();
        });
    });

    // 分页
    $("#first").click(() => {
        currentPage = 1;
    loadList();
});
    $("#prev").click(() => {
        if (currentPage > 1) currentPage--;
    loadList();
});
    $("#next").click(() => {
        if (currentPage < totalPage) currentPage++;
    loadList();
});
    $("#last").click(() => {
        currentPage = totalPage;
    loadList();
});

    $("#pageSizeSelect").change(function () {
        pageSize = $(this).val();
        currentPage = 1;
        loadList();
    });
}

// 新增搜索
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
        panel.append('<div class="dealer-item">未找到</div>');
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

// 编辑搜索
function searchEditDealer() {
    let key = $("#edit_dealerSearch").val().toLowerCase().trim();
    let panel = $("#edit_dealerPanel").empty();
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
            panel.append(`<div class="dealer-item" onclick="selectEditDealer(${item.id},'${item.dealerName}')">${item.dealerName}</div>`);
    });
    }
}

function selectEditDealer(id, name) {
    selectedDealerId = id;
    $("#edit_dealerSearch").val(name);
    $("#edit_dealerId").val(id);
    $("#edit_dealerPanel").hide();
}

function loadDealers() {
    $.get("/api/dealer/all", res => allDealers = res);
}

function loadList() {
    $.get("/api/activityConfig/list", { pageNum: currentPage, pageSize: pageSize }, res => {
        let html = "";
    res.list.forEach((item, index) => {
        html += `
            <tr>
                <td class="data-id" style="display:none">${item.id}</td>
                <td>${index + 1}</td>
                <td>${item.activityType}</td>
                <td>${item.activityComment}</td>
                <td>
                    <button class="btn btn-edit edit-btn">编辑</button>
                    <button class="btn btn-del del-btn">删除</button>
                </td>
            </tr>`;
});

    $("#table").html(html);
    $("#total").text(res.total);
    totalPage = res.pages;
    $("#pageInfo").text("第 " + currentPage + " / " + totalPage + " 页");
});
}