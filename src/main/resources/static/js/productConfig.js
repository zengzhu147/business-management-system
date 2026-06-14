let currentPage = 1;
let pageSize = 10;
let totalPage = 1;

// 产品名称校验状态
let addNameValid = true;
let editNameValid = true;

$(function () {
    loadList();
    bindEvents();
});

// 公共校验方法：校验产品名称是否重复
function checkProductName(name, excludeId, callback) {
    let params = { productName: name };
    if (excludeId) {
        params.id = excludeId;
    }
    $.get("/api/productConfig/checkProductName", params, function (res) {
        callback(res);
    });
}

function bindEvents() {
    // 打开新增弹窗，重置状态与提示
    $("#openAdd").click(function () {
        $("#productForm")[0].reset();
        addNameValid = true;
        $("#add_name_tip").hide();
        $("#addModal").fadeIn();
    });

    // 取消按钮：关闭弹窗 + 隐藏错误提示
    $(".btn-cancel").click(function () {
        $(".mask").fadeOut();
        $("#add_name_tip").hide();
        $("#edit_name_tip").hide();
        addNameValid = true;
        editNameValid = true;
    });

    // ========== 新增-产品名称 失焦校验 ==========
    $("#add_productName").blur(function () {
        let name = $.trim($(this).val());
        if (!name) {
            $("#add_name_tip").hide();
            addNameValid = true;
            return;
        }
        checkProductName(name, null, function (isExist) {
            if (isExist) {
                $("#add_name_tip").show();
                addNameValid = false;
            } else {
                $("#add_name_tip").hide();
                addNameValid = true;
            }
        });
    });

    // ========== 编辑-产品名称 失焦校验 ==========
    $("#edit_productName").blur(function () {
        let name = $.trim($(this).val());
        let id = $("#edit_id").val();
        if (!name) {
            $("#edit_name_tip").hide();
            editNameValid = true;
            return;
        }
        checkProductName(name, id, function (isExist) {
            if (isExist) {
                $("#edit_name_tip").show();
                editNameValid = false;
            } else {
                $("#edit_name_tip").hide();
                editNameValid = true;
            }
        });
    });

    // 新增提交：前置校验
    $("#productForm").submit(function (e) {
        e.preventDefault();
        if (!addNameValid) {
            alert("该产品名称已存在，请修改！");
            return;
        }
        let formData = $(this).serialize();
        $.post("/api/productConfig/add", formData, function () {
            alert("保存成功！");
            location.reload();
        });
    });

    // 编辑按钮：打开弹窗，重置校验状态
    $(document).on("click", ".edit-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        $.get("/api/productConfig/getProductConfigInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#edit_id").val(data.id);
            $("#edit_productName").val(data.productName);
            $("#edit_price").val(data.price);
            $("#edit_comment").val(data.comment);

            editNameValid = true;
            $("#edit_name_tip").hide();
            $("#editModal").fadeIn();
        });
    });

    // 编辑提交：前置校验
    $("#editForm").submit(function (e) {
        e.preventDefault();
        if (!editNameValid) {
            alert("该产品名称已存在，请修改！");
            return;
        }
        let formData = $(this).serialize();
        $.post("/api/productConfig/update", formData, function () {
            alert("修改成功！");
            location.reload();
        });
    });

    // 删除
    $(document).on("click", ".del-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        if (confirm("确定删除？")) {
            $.get("/api/productConfig/delete?id=" + id, function () {
                loadList();
            });
        }
    });

    // 详情
    $(document).on("click", ".btn-view", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        $.get("/api/productConfig/getProductConfigInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#detail_productName").val(data.productName);
            $("#detail_price").val(data.price);
            $("#detail_comment").val(data.comment);
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

    // 每页条数切换
    $("#pageSizeSelect").change(function () {
        pageSize = $(this).val();
        currentPage = 1;
        loadList();
    });
}

// 加载产品列表
function loadList() {
    $.get("/api/productConfig/list", { pageNum: currentPage, pageSize: pageSize }, res => {
        let html = "";
    res.list.forEach((item, index) => {
        html += `
            <tr>
                <td class="data-id" style="display:none">${item.id}</td>
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td>${item.price}</td>
                <td>${item.comment}</td>
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