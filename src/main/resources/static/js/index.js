document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.nav-item, .card');

    items.forEach(item => {
        item.addEventListener('click', function () {
        const page = this.dataset.page;

        // ✅ 这里全部是 绝对路径跳转
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
        }
    });
});
});