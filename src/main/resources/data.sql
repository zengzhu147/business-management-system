-- 1. H2 兼容建表语句（去掉引擎、字符集、行内索引，注释简化）
CREATE TABLE IF NOT EXISTS dealer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dealerName VARCHAR(100) NOT NULL,
    dealerLeader VARCHAR(50),
    provinceCode VARCHAR(50),
    cityCode VARCHAR(50),
    areaCode VARCHAR(50),
    dealerPhone VARCHAR(50),
    dealerAddress VARCHAR(200),
    seller VARCHAR(50)
);

-- 2. 单独添加唯一索引（实现经销商名称不重复）
CREATE UNIQUE INDEX IF NOT EXISTS uk_dealer_name ON dealer(dealerName);

CREATE TABLE IF NOT EXISTS sale_order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dealerId BIGINT,
    dealerName VARCHAR(50),
    productId BIGINT COMMENT '产品id',
    orderDate DATETIME,
    quantity BIGINT,
    price DECIMAL(12,2),
    totalAmount DECIMAL(12,2),
    marketFee DECIMAL(12,2),
    expectRate DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS region (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(32) NOT NULL COMMENT '地区编码',
    name VARCHAR(64) NOT NULL COMMENT '地区名称',
    parent_code VARCHAR(32) NULL COMMENT '父编码',
    level INT NOT NULL COMMENT '1省 2市 3区县'
);

CREATE TABLE IF NOT EXISTS activity_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dealerId BIGINT COMMENT '经销商ID',
    activityType VARCHAR(50) COMMENT '活动类型',
    activityComment VARCHAR(100) NULL COMMENT '活动备注'
);

CREATE TABLE IF NOT EXISTS product_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(50) COMMENT '产品名称',
    price DECIMAL(12,2) COMMENT '产品单价',
    comment VARCHAR(100) NULL COMMENT '产品备注'
);

CREATE TABLE IF NOT EXISTS activity_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activityTypeId BIGINT COMMENT '活动类型ID',
    dealerId BIGINT COMMENT '经销商ID',
    activityType VARCHAR(50) COMMENT '活动类型',
    activityTime DATETIME COMMENT '活动时间',

    applyFee DECIMAL(12,2) COMMENT '申请费用',
    writeOffStatus VARCHAR(100) NULL COMMENT '核销情况',
    activityContent VARCHAR(100) NULL COMMENT '活动内容'

    );