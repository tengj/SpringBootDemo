require.config(requireConfig);
define(['jquery',
    'fly',
    'common',
    'message',
    'util',
    'pages/head',
    'fancybox'
], function ($, fly, common, message, util) {
    $(function () {
        gvm.loadMsgNum();
        gvm.loadMsgList();
        gvm.loadNav();
        gvm.dropEvent();
        uvm.loadUvm();
        uvm.uploadImg();
    });
});
