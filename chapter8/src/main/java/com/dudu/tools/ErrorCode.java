package com.dudu.tools;


public enum ErrorCode {
	
	ID_IS_NULL(400,"ID_IS_NULL", "ID为空!"),
	ENT_CODE_IS_NULL(400,"ENT_CODE_IS_NULL","企业编码为空!"),
	ADMIN_ACCOUNT_IS_NULL(400,"ADMIN_ACCOUNT_IS_NULL"," 企业管理员账号为空!"),
	UUID_IS_NULL(400,"UUID_IS_NULL"," UUID为空!"), MODIFY_FAIL(400,"MODIFY_FAIL","修改失败!"),
	
	//题库
	TEST_CATALOG_NAME_IS_NULL(400,"TEST_CATALOG_NAME_IS_NULL","题库名称为空!"),
	TEST_CATALOG_NAME_TOO_LONG(400,"TEST_CATALOG_TOO_LONG","题库名称长度过长!"),
	TEST_CATALOG_NAME_EXIST(400,"TEST_CATALOG_NAME_EXIST","题库名称已存在!"),
	TEST_CATALOG_NOT_EXIST(400,"TEST_CATALOG_NOT_EXIST","题库不存在!"),
	TEST_CATALOG_ACTIVE_FAIL(400,"TEST_CATALOG_ACTIVE_FAIL","题库激活失败!"),
	TEST_CATALOG_LOCK_FAIL(400,"TEST_CATALOG_LOCK_FAIL","题库禁用失败!"),
	TEST_CATALOG_MEMO_TOO_LONG(400,"TEST_CATALOG_TOO_LONG","题库描述长度过长!"),
	STATE_FORMAT_ERROR(400,"STATE_FORMAT_ERROR","状态参数格式有误!"),
	STATE_IS_NULL(400,"STATE_IS_NULL","状态为空!"),
	TEST_CATALOG_ADD_FAIL(400,"TEST_CATALOG_ADD_FAIL","题库信息添加失败!"),
	TEST_CATALOG_DELETE_FAIL(400,"TEST_CATALOG_DELETE_FAIL","题库信息删除失败！"),
	TEST_CATALOG_UPDATE_FAIL(400,"TEST_CATALOG_UPDATE_FAIL","题库信息修改失败!"), 
	OPT_IS_NULL(400,"OPT_IS_NULL","操作动作为空!");

    // 成员变量
	private int httpStatus;
    private String code;
    private String message;
    private int res_code;

    // 构造方法
    private ErrorCode(int httpStatus, String code, String message) {
    	this.setHttpStatus(200);
    	this.setRes_code(httpStatus);
        this.setCode(code);
		this.setMessage(message);
    }
    private ErrorCode() {
    	this.setHttpStatus(httpStatus);
        this.setCode(code);
		this.setMessage(message);
    }
	public int getHttpStatus() {
		return httpStatus;
	}

	public void setHttpStatus(int httpStatus) {
		this.httpStatus = httpStatus;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getRes_code() {
		return res_code;
	}

	public void setRes_code(int res_code) {
		this.res_code = res_code;
	}

}
