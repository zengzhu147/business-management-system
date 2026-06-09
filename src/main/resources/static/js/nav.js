document.addEventListener('DOMContentLoaded', function () {
    // 导航点击跳转（绝对路径）
    const items = document.querySelectorAll('.nav-item, .card');
    items.forEach(item => {
        item.addEventListener('click', function () {
        const page = this.dataset.page;
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
        }
    });
});

    // 自动高亮当前页面
    const path = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    if (path.includes('index')) {
        document.querySelector('[data-page="index"]').classList.add('active');
    } else if (path.includes('dealer')) {
        document.querySelector('[data-page="dealer"]').classList.add('active');
    } else if (path.includes('order')) {
        document.querySelector('[data-page="order"]').classList.add('active');
    } else if (path.includes('activityConfig')) {
        document.querySelector('[data-page="activityConfig"]').classList.add('active');
    }
});