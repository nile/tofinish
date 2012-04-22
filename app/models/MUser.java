package models;

import play.db.jpa.Model;

import javax.persistence.Entity;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * MUser: nile
 * Date: 12-4-4
 * Time: 上午12:19
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class MUser extends Model {
    public String email;
    public String password;

    public List<MBoard> boards() {
        final List<MBoard> boards = MBoard.find(" user = ?", this).fetch();
        return boards;
    }

    public static void register(String email, String password) {
        MUser user = new MUser();
        user.email = email;
        user.password = password;
        user.save();

    }
    public static MUser getByEmail(String email){
        return MUser.find("email = ?", email).first();
    }
}
