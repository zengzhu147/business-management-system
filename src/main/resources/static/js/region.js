// 页面加载完成后执行
$(document).ready(function () {
    // 初始化加载省份
    loadProvinces();
});

// 加载省份
function loadProvinces() {
    $.get("/region/provinces", function (res) {
        let sel = $("#province");
        sel.empty().append('<option value="">请选择省份</option>');
        res.forEach(r => sel.append(`<option value="${r.code}">${r.name}</option>`));
    });
}

// 加载城市
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

// 加载区县
function loadAreas() {
    let code = $("#city").val();
    let sel = $("#area");
    sel.empty().append('<option value="">请选择区县</option>');

    if (!code) return;

    $.get("/region/areas", { cityCode: code }, function (res) {
        res.forEach(r => sel.append(`<option value="${r.code}">${r.name}</option>`));
    });
}