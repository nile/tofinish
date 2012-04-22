package controllers;

import models.MUser;
import play.mvc.Before;
import play.mvc.Controller;

/**
 * Created by IntelliJ IDEA.
 * User: nile
 * Date: 12-4-4
 * Time: 上午1:33
 * To change this template use File | Settings | File Templates.
 */
public class LoginUserFilter extends Controller {
    @Before
    static void before() {
        if (session.contains("email")) {
            renderArgs.put("user", MUser.getByEmail(session.get("email")));
        }
    }
    static boolean isUserLogin(){
        return session.contains("email");
    }
    static MUser getLoginUser() {
        return MUser.getByEmail(session.get("email"));
    }
}
