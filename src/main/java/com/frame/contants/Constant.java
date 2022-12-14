package com.frame.contants;

public class Constant {

    public class WebSocketConstant {
        public static final String ONLINE_WEBSOCKET_PREFIX = "online-webSock";
        public static final String CHAT_MESSAGES_PREFIX = "chat-message";
        public static final String CHAT_CLIENTS_HASH = "chat-client-hash";
    }

    /**
     * 验证码key 前缀
     */
    public static final String CODE_PREFIX = "code-";

    /**
     * Contants 加入 用户名 key 常量
     * 用户名称 key
     */
    public static final String JWT_USER_NAME="jwt-user-name-key";

    /**
     * 角色信息key
     */
    public static final String ROLES_INFOS_KEY="roles-infos-key";

    /**
     * 权限信息key
     */
    public static final String PERMISSIONS_INFOS_KEY="permissions-infos-key";

    /**
     *  业务访问token
     */
    public static final String ACCESS_TOKEN="authorization";

    /**
     * 主动去刷新 token key(适用场景 比如修改了用户的角色/权限去刷新token)
     */
    public static final String JWT_REFRESH_KEY="jwt-refresh-key_";

    /**
     * 标记用户是否已经被锁定
     */
    public static final String ACCOUNT_LOCK_KEY="account-lock-key_";
    /**
     * 标记用户是否已经删除
     */
    public static final String DELETED_USER_KEY="deleted-user-key_";

    /**
     * 用户权鉴缓存 key
     */
    public static final String IDENTIFY_CACHE_KEY="shiro-cache:com.yingxue.lesson.shiro.CustomRealm.authorizationCache:";


}
