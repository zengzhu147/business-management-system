let currentPage = 1;
let pageSize = 10;
let totalPage = 1;
// 标记名称是否合法
let addNameValid = true;
let editNameValid = true;

$(function () {
    loadDealerList();
    loadProvinces();

    // 新增弹窗打开/关闭
    $("#openAdd").click(function () {
        $("#addModal").fadeIn();
        // 重置校验状态
        addNameValid = true;
        $("#add_name_tip").hide();
    });
    $("#closeModal").click(function () {
        $("#addModal").fadeOut();
        $("#addForm")[0].reset();
        $("#add_name_tip").hide();
        addNameValid = true;
    });

    // 新增名称失焦校验
    $("#add_dealerName").blur(function () {
        let name = $.trim($(this).val());
        if (!name) {
            $("#add_name_tip").hide();
            addNameValid = true;
            return;
        }
        checkDealerName(name, null, function (isExist) {
            if (isExist) {
                $("#add_name_tip").show();
                addNameValid = false;
            } else {
                $("#add_name_tip").hide();
                addNameValid = true;
            }
        });
    });

    // 新增表单提交
    $("#addForm").submit(function (e) {
        e.preventDefault();
        if (!addNameValid) {
            alert("经销商名称已存在，请修改！");
            return;
        }
        $.post("/api/dealer/add", $(this).serialize(), function () {
            location.reload();
        });
    });

    // ====================== 编辑弹窗 ======================
    $(document).on("click", ".edit-btn", function () {
        let tr = $(this).closest("tr");
        let id = tr.find(".data-id").text();
        let dealerName = tr.find(".data-dealerName").text();
        let dealerLeader = tr.find(".data-dealerLeader").text();
        let dealerPhone = tr.find(".data-dealerPhone").text();
        let dealerAddress = tr.find(".data-dealerAddress").text();
        let seller = tr.find(".data-seller").text();

        let provinceCode = tr.find(".data-provinceCode").text();
        let cityCode = tr.find(".data-cityCode").text();
        let areaCode = tr.find(".data-areaCode").text();

        $("#edit_id").val(id);
        $("#edit_dealerName").val(dealerName);
        $("#edit_dealerLeader").val(dealerLeader);
        $("#edit_dealerPhone").val(dealerPhone);
        $("#edit_dealerAddress").val(dealerAddress);
        $("#edit_seller").val(seller);

        // 重置编辑校验
        editNameValid = true;
        $("#edit_name_tip").hide();

        // 回显省市区
        loadEditProvinces(function () {
            $("#editProvince").val(provinceCode);
            loadEditCities(function () {
                $("#editCity").val(cityCode);
                loadEditAreas(function () {
                    $("#editArea").val(areaCode);
                });
            });
        });
        $("#editModal").fadeIn();
    });

    $("#closeEditModal").click(function () {
        $("#editModal").fadeOut();
        $("#edit_name_tip").hide();
        editNameValid = true;
    });

    // 编辑名称失焦校验
    $("#edit_dealerName").blur(function () {
        let name = $.trim($(this).val());
        let id = $("#edit_id").val();
        if (!name) {
            $("#edit_name_tip").hide();
            editNameValid = true;
            return;
        }
        // 编辑传当前ID，排除自身
        checkDealerName(name, id, function (isExist) {
            if (isExist) {
                $("#edit_name_tip").show();
                editNameValid = false;
            } else {
                $("#edit_name_tip").hide();
                editNameValid = true;
            }
        });
    });

    // 编辑表单提交
    $("#editForm").submit(function (e) {
        e.preventDefault();
        if (!editNameValid) {
            alert("经销商名称已存在，请修改！");
            return;
        }
        $.post("/api/dealer/update", $(this).serialize(), function () {
            location.reload();
        });
    });

    // 删除
    $(document).on("click", ".del-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        if (confirm("确定删除？")) {
            $.get("/api/dealer/delete?id=" + id, function () {
                loadDealerList();
            });
        }
    });

    // 分页
    $("#first").click(() => {
        currentPage = 1;
    loadDealerList();
});
    $("#prev").click(() => {
        if (currentPage > 1) currentPage--;
    loadDealerList();
});
    $("#next").click(() => {
        if (currentPage < totalPage) currentPage++;
    loadDealerList();
});
    $("#last").click(() => {
        currentPage = totalPage;
    loadDealerList();
    loadDealerList();
});
    $("#pageSizeSelect").change(function () {
        pageSize = $(this).val();
        currentPage = 1;
        loadDealerList();
    });
});

// ====================== 【核心】经销商名称重复校验接口 ======================
/**
 * @param name 待校验名称
 * @param excludeId 编辑时排除当前ID（新增传null/空）
 * @param callback 回调：true=已存在，false=可用
 */
function checkDealerName(name, excludeId, callback) {
    let params = { dealerName: name };
    if (excludeId) {
        params.id = excludeId;
    }
    $.get("/api/dealer/checkName", params, function (res) {
        callback(res);
    });
}

// ====================== 列表加载 ======================
function loadDealerList() {
    $.get("/api/dealer/list", { pageNum: currentPage, pageSize: pageSize }, function (res) {
        let html = "";
        if (Array.isArray(res)) {
            res.forEach(item => {
                html += `
                <tr>
                    <td class="data-id" style="display:none">${item.id}</td>
                    <td class="data-dealerName">${item.dealerName}</td>
                    <td class="data-dealerLeader">${item.dealerLeader}</td>
                    <td class="data-dealerPhone">${item.dealerPhone}</td>
                    <td class="data-provinceName">${item.provinceName}</td>
                    <td class="data-cityName">${item.cityName}</td>
                    <td class="data-areaName">${item.areaName}</td>
                    <td class="data-provinceCode" style="display:none">${item.provinceCode}</td>
                    <td class="data-cityCode" style="display:none">${item.cityCode}</td>
                    <td class="data-areaCode" style="display:none">${item.areaCode}</td>
                    <td class="data-dealerAddress">${item.dealerAddress}</td>
                    <td class="data-seller">${item.seller}</td>
                    <td>
                        <button class="btn btn-edit edit-btn">编辑</button>
                        <button class="btn btn-del del-btn">删除</button>
                    </td>
                </tr>`;
        });
            $("#dealerTable").html(html);
            $("#total").text(res.length);
            totalPage = 1;
            $("#pageInfo").text("第 " + currentPage + " 页");
        } else {
            res.list.forEach(item => {
                html += `
                <tr>
                    <td class="data-id" style="display:none">${item.id}</td>
                    <td class="data-dealerName">${item.dealerName}</td>
                    <td class="data-dealerLeader">${item.dealerLeader}</td>
                    <td class="data-dealerPhone">${item.dealerPhone}</td>
                    <td class="data-provinceName">${item.provinceName}</td>
                    <td class="data-cityName">${item.cityName}</td>
                    <td class="data-areaName">${item.areaName}</td>
                    <td class="data-provinceCode" style="display:none">${item.provinceCode}</td>
                    <td class="data-cityCode" style="display:none">${item.cityCode}</td>
                    <td class="data-areaCode" style="display:none">${item.areaCode}</td>
                    <td class="data-dealerAddress">${item.dealerAddress}</td>
                    <td class="data-seller">${item.seller}</td>
                    <td>
                        <button class="btn btn-edit edit-btn">编辑</button>
                        <button class="btn btn-del del-btn">删除</button>
                    </td>
                </tr>`;
        });
            $("#dealerTable").html(html);
            $("#total").text(res.total);
            totalPage = res.pages;
            $("#pageInfo").text("第 " + currentPage + " / " + totalPage + " 页");
        }
    });
}

// ====================== 新增：省市区 ======================
function loadProvinces() {
    $.get("/region/provinces", function (res) {
        let sel = $("#province");
        sel.empty().append('<option value="">请选择省份</option>');
        res.forEach(r => sel.append(`<option value="${r.code}">${r.name}</option>`));
    });
}

function loadCities() {
    let code = $("#province").val();
    let sel = $("#city");
    sel.empty().append('<option value="">请选择城市</option>');
    $("#area").empty().append('<option value="">请选择区县</option>');
    if (!code) return;
    $.get("/region/cities", { provinceCode: code }, function (res) {
        res.forEach(r => sel.append(`<option value="${r.code}">${r.name}</option>`));
    });
}

function loadAreas() {
    let code = $("#city").val();
    let sel = $("#area");
    sel.empty().append('<option value="">请选择区县</option>');
    if (!code) return;
    $.get("/region/areas", { cityCode: code }, function (res) {
        res.forEach(r => sel.append(`<option value="${r.code}">${r.name}</option>`));
    });
}

// ====================== 编辑：省市区 ======================
function loadEditProvinces(callback) {
    $.get("/region/provinces", function (res) {
        let sel = $("#editProvince");
        sel.empty().append('<option value="">请选择省份</option>');
        res.forEach(r => sel.append(`<option value="${r.code}">${r.name}</option>`));
        if (callback) callback();
    });
}

function loadEditCities(callback) {
    let code = $("#editProvince").val();
    let sel = $("#editCity");
    sel.empty().append('<option value="">请选择城市</option>');
    $("#editArea").empty().append('<option value="">请选择区县</option>');
    if (!code) return;
    $.get("/region/cities", { provinceCode: code }, function (res) {
        res.forEach(r => sel.append(`<option value="${r.code}">${r.name}</option>`));
        if (callback) callback();
    });
}

function loadEditAreas(callback) {
    let code = $("#editCity").val();
    let sel = $("#editArea");
    sel.empty().append('<option value="">请选择区县</option>');
    if (!code) return;
    $.get("/region/areas", { cityCode: code }, function (res) {
        res.forEach(r => sel.append(`<option value="${r.code}">${r.name}</option>`));
        if (callback) callback();
    });
}