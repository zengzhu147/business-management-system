let currentPage = 1;
let pageSize = 10;
let totalPage = 1;
let allDealers = [];
let selectedDealerId = null;

$(function () {
    loadList();
    loadDealers();
    bindEvents();
});

function bindEvents() {
    $("#openAdd").click(function () {
        $("#activityForm")[0].reset();
        selectedDealerId = null;
        $("#dealerId").val("");
        $("#dealerPanel").hide();
        $("#addModal").fadeIn();
    });

    $(".btn-cancel").click(function () {
        $(".mask").fadeOut();
        $("#dealerPanel").hide();
        $("#edit_dealerPanel").hide();
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

    // 新增提交
    $("#activityForm").submit(function (e) {
        e.preventDefault();
        let formData = $(this).serialize();
        $.post("/api/activityConfig/add", formData, function () {
            alert("保存成功！");
            location.reload();
        });
    });

    // 编辑
    $(document).on("click", ".edit-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        $.get("/api/activityConfig/getActivityConfigInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#edit_id").val(data.id);
            $("#edit_dealerId").val(data.dealerId);
            $("#edit_dealerSearch").val(data.dealerName);
            $("#edit_activityType").val(data.activityType);
            $("#edit_activityComment").val(data.activityComment);
            $("#editModal").fadeIn();
        });
    });

    // 编辑提交
    $("#editForm").submit(function (e) {
        e.preventDefault();
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
            $("#detail_dealerName").val(data.dealerName);
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
                <td>${item.dealerName}</td>
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