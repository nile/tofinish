package controllers;

import play.mvc.Mailer;

/**
 * Created by IntelliJ IDEA.
 * User: nile
 * Date: 12-4-4
 * Time: 上午1:01
 * To change this template use File | Settings | File Templates.
 */
public class Notifier extends Mailer {
    public static void active(String email, String password) {
        setFrom("tofinish@broada.com");
        setSubject("帐号激活");
        addRecipient(email);
        send(email, password);
    }
}
