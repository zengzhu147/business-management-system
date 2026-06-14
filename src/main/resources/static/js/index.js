document.addEventListener('DOMContentLoaded', function () {
    // 绑定所有可点击项：一级菜单、二级子菜单、快捷卡片
    const items = document.querySelectorAll('.nav-item, .sub-item, .card');

    items.forEach(item => {
        item.addEventListener('click', function () {
        const page = this.dataset.page;
        if(!page) return;

        // 绝对路径跳转
        switch (page) {
            case 'index':
                window.location.href = '/index/indexPage';
                break;
            case 'dealer':
                window.location.href = '/dealer/dealerPage';
                break;
            case 'order':
                window.location.href = '/order/orderPage';
                break;
            case 'activityConfig':
                window.location.href = '/activityConfig/activityConfigPage';
                break;
            case 'productConfig':
                window.location.href = '/productConfig/productConfigPage';
                break;
            case 'activity':
                // 你可自行替换活动页面真实地址
                window.location.href = '/activity/activityPage';
                break;
        }
    });
});
});