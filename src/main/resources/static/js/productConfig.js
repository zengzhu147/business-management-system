let currentPage = 1;
let pageSize = 10;
let totalPage = 1;

$(function () {
    loadList();
    bindEvents();
});

function bindEvents() {
    // 打开新增弹窗
    $("#openAdd").click(function () {
        $("#productForm")[0].reset();
        $("#addModal").fadeIn();
    });

    // 取消按钮
    $(".btn-cancel").click(function () {
        $(".mask").fadeOut();
    });

    // 新增提交
    $("#productForm").submit(function (e) {
        e.preventDefault();
        let formData = $(this).serialize();
        $.post("/api/productConfig/add", formData, function () {
            alert("保存成功！");
            location.reload();
        });
    });

    // 编辑按钮
    $(document).on("click", ".edit-btn", function () {
        let id = $(this).closest("tr").find(".data-id").text();
        $.get("/api/productConfig/getProductConfigInfo", { id }, function (dataList) {
            var data = dataList[0];
            $("#edit_id").val(data.id);
            $("#edit_productName").val(data.productName);
            $("#edit_price").val(data.price);
            $("#edit_comment").val(data.comment);
            $("#editModal").fadeIn();
        });
    });

    // 编辑提交
    $("#editForm").submit(function (e) {
        e.preventDefault();
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